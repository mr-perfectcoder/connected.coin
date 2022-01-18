export const shortlenAddress = (address) =>
  `${address.slice(0, 5)}...${address.slice(address.length - 4)}`
