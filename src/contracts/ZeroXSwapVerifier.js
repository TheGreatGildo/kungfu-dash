// Auto-generated contract library
// This file is generated from compiled Solidity contracts and their NatSpec comments

export const ZeroXSwapVerifier = {
    name: "ZeroXSwapVerifier",
    title: "ZeroXSwapVerifier",
    notice: "",
    abi: [
  {
    "type": "function",
    "name": "verifySwapCalldata",
    "inputs": [
      {
        "name": "calldata_",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "targetToken",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "maxSlippageBps",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "verified",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  }
],
    viewFunctions: [
  {
    "name": "verifySwapCalldata",
    "inputs": [
      {
        "name": "calldata_",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "targetToken",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "maxSlippageBps",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "verified",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function verifySwapCalldata"
  }
],
    writeFunctions: [],
  };
