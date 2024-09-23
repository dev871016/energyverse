export const shortenAddress = (address) => {
  return `${address.substring(0, 5)}...${address.substring(
    address.length - 6,
    address.length
  )}`;
};

export const shortenHash = (hash) => {
  return `${hash.substring(0, 13)}...`;
};
