// Auto-generated contract library
// This file is generated from compiled Solidity contracts and their NatSpec comments

export const AlchemistAllocator = {
    name: "AlchemistAllocator",
    title: "AlchemistAllocator",
    notice: "This contract is used to allocate and deallocate funds to and from MYT strategies",
    abi: [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_vault",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_admin",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_operator",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "allocate",
    "inputs": [
      {
        "name": "adapter",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "deallocate",
    "inputs": [
      {
        "name": "adapter",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "proxy",
    "inputs": [
      {
        "name": "vault",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "setAdmin",
    "inputs": [
      {
        "name": "_admin",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setOperator",
    "inputs": [
      {
        "name": "_operator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setPermissionedCall",
    "inputs": [
      {
        "name": "sig",
        "type": "bytes4",
        "internalType": "bytes4"
      },
      {
        "name": "value",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "AddedPermissionedCall",
    "inputs": [
      {
        "name": "sig",
        "type": "bytes4",
        "indexed": true,
        "internalType": "bytes4"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "AdminUpdated",
    "inputs": [
      {
        "name": "admin",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OperatorUpdated",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  }
],
    viewFunctions: [],
    writeFunctions: [
  {
    "name": "allocate",
    "inputs": [
      {
        "name": "adapter",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable",
    "natspec": "Function allocate"
  },
  {
    "name": "deallocate",
    "inputs": [
      {
        "name": "adapter",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable",
    "natspec": "@notice When deallocating total amounts, consider using IMYTStrategy(address(strategy)).previewAdjustedWithdraw(amount) as the amount to be passed in for `amount` to estimate the correct amount that can be fully withdrawn, accounting for losses due to slippage, protocol fees, and rounding differences"
  },
  {
    "name": "proxy",
    "inputs": [
      {
        "name": "vault",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable",
    "natspec": "Function proxy"
  },
  {
    "name": "setAdmin",
    "inputs": [
      {
        "name": "_admin",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable",
    "natspec": "Function setAdmin"
  },
  {
    "name": "setOperator",
    "inputs": [
      {
        "name": "_operator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable",
    "natspec": "Function setOperator"
  },
  {
    "name": "setPermissionedCall",
    "inputs": [
      {
        "name": "sig",
        "type": "bytes4",
        "internalType": "bytes4"
      },
      {
        "name": "value",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable",
    "natspec": "Function setPermissionedCall"
  }
],
  };
