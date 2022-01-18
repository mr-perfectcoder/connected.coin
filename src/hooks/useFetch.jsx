import { useState, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_GIPHY_API

const useFetch = ({ keyword }) => {
  const [gifUrl, setGifUrl] = useState('initialState')

  const fetchGifs = async () => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${keyword
          .split(' ')
          .join('')}&limit=1`
      )
      const { data } = await response.json()

      setGifUrl(data[0]?.images?.downsized_medium.url)
      if (!data.length) {
        setGifUrl(
          'https://media3.giphy.com/media/kKo2x2QSWMNfW/giphy.gif?cid=d25b4bafxodn65g0783qxi0zrz9ywybigxpp93mr9rwk18ey&rid=giphy.gif&ct=g'
        )
      }
    } catch (error) {
      setGifUrl(
        'https://media3.giphy.com/media/kKo2x2QSWMNfW/giphy.gif?cid=d25b4bafxodn65g0783qxi0zrz9ywybigxpp93mr9rwk18ey&rid=giphy.gif&ct=g'
      )
    }
  }

  useEffect(() => {
    if (keyword) fetchGifs()
  }, [keyword])

  return gifUrl
}

export default useFetch
