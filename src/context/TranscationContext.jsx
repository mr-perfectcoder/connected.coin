import React, { useEffect, useState } from 'react'

import { ethers } from 'ethers'
import { contractABI, contractAddress } from '../utils/constants'
import { SiEthereum } from 'react-icons/si'

export const TranscationContext = React.createContext()

const { ethereum } = window

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()

  const transactionContact = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  )

  return transactionContact
}

export const TranscationProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [formData, setFormData] = useState({
    addressTo: '',
    amount: '',
    keyword: '',
    message: '',
  })

  const [isLoading, setIsLoading] = useState(false)

  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem('transactionCount')
  )
  const [transactions, setTransactions] = useState([])

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }))
  }

  const getAllTransactions = async () => {
    try {
      if (!ethereum) return alert('Please install metamask')

      const transactionContact = getEthereumContract()
      const availableTransactions =
        await transactionContact.getAllTransactions()

      const structutedTransactions = availableTransactions.map((trans) => ({
        addressTo: trans.receiver,
        addressFrom: trans.sender,
        timestamp: new Date(trans.timestamp.toNumber() * 1000).toLocaleString(),
        message: trans.message,
        keyword: trans.keyword,
        amount: parseInt(trans.amount._hex) / 10 ** 18,
      }))
      console.log(structutedTransactions)
      setTransactions(structutedTransactions)
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert('Please install metamask')

      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length) {
        setCurrentAccount(accounts[0])
        getAllTransactions()
        // getAllTranction()
      } else {
        console.log('No account found')
      }
    } catch (error) {
      console.log(error)
      throw new Error('No ethereum object ...')
    }
  }

  const checkIsTransExist = async () => {
    try {
      const transactionContact = getEthereumContract()
      const transactionCount = await transactionContact.getTransactionCount()
      window.localStorage.setItem('transactionCount', transactionCount)
    } catch (error) {
      console.log(error)
      throw new Error('No ethereum object ...')
    }
  }

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert('Please install metamask')
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
      throw new Error('No ethereum object ...')
    }
  }

  const sendTranscation = async () => {
    try {
      if (!ethereum) return alert('Please install metamask')
      const { addressTo, amount, keyword, message } = formData

      const transactionContact = getEthereumContract()
      const parsedAmount = ethers.utils.parseEther(amount)
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: '0x5208', //21000 gas
            value: parsedAmount._hex,
          },
        ],
      })

      const transactionHased = await transactionContact.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      )
      setIsLoading(true)
      console.log(`Loading - ${transactionHased.hash}`)
      await transactionHased.wait()
      setIsLoading(false)
      console.log(`Sucess - ${transactionHased.hash}`)
      const transactionCount = await transactionContact.getTransactionCount()
      setTransactionCount(transactionCount.toNumber())
      window.location.reload()
    } catch (error) {
      console.log(error)
      throw new Error('No ethereum object ...')
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
    checkIsTransExist()
  }, [])

  return (
    <TranscationContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setFormData,
        handleChange,
        sendTranscation,
        transactions,
        isLoading,
      }}
    >
      {children}
    </TranscationContext.Provider>
  )
}
