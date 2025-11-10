// Auto-generated contract library
// This file is generated from compiled Solidity contracts and their NatSpec comments

export const PerpetualGauge = {
    name: "PerpetualGauge",
    title: "PerpetualGauge",
    notice: "",
    abi: [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_stratClassifier",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_allocatorProxy",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_votingToken",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "MAX_VOTE_DURATION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MIN_RESET_DURATION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "allocatorProxy",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IAllocatorProxy"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "clearVote",
    "inputs": [
      {
        "name": "ytId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "executeAllocation",
    "inputs": [
      {
        "name": "ytId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "totalIdleAssets",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getCurrentAllocations",
    "inputs": [
      {
        "name": "ytId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "strategyIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "normalizedWeights",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "lastStrategyAddedAt",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "registerNewStrategy",
    "inputs": [
      {
        "name": "ytId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "strategyId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "stratClassifier",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IStrategyClassifier"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "strategyList",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "vote",
    "inputs": [
      {
        "name": "ytId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "strategyIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "weights",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "votes",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "expiry",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "votingToken",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IERC20"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "AllocationExecuted",
    "inputs": [
      {
        "name": "ytId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "strategyIds",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      },
      {
        "name": "amounts",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "VoteUpdated",
    "inputs": [
      {
        "name": "voter",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "ytId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "strategyIds",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      },
      {
        "name": "weights",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      },
      {
        "name": "expiry",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "VoterCleared",
    "inputs": [
      {
        "name": "voter",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "ytId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "ReentrancyGuardReentrantCall",
    "inputs": []
  }
],
    viewFunctions: [
  {
    "name": "MAX_VOTE_DURATION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function MAX_VOTE_DURATION"
  },
  {
    "name": "MIN_RESET_DURATION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function MIN_RESET_DURATION"
  },
  {
    "name": "allocatorProxy",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IAllocatorProxy"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function allocatorProxy"
  },
  {
    "name": "getCurrentAllocations",
    "inputs": [
      {
        "name": "ytId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "strategyIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "normalizedWeights",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function getCurrentAllocations"
  },
  {
    "name": "lastStrategyAddedAt",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function lastStrategyAddedAt"
  },
  {
    "name": "stratClassifier",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IStrategyClassifier"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function stratClassifier"
  },
  {
    "name": "strategyList",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function strategyList"
  },
  {
    "name": "votes",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "expiry",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function votes"
  },
  {
    "name": "votingToken",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IERC20"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function votingToken"
  }
],
    writeFunctions: [
  {
    "name": "clearVote",
    "inputs": [
      {
        "name": "ytId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable",
    "natspec": "Function clearVote"
  },
  {
    "name": "executeAllocation",
    "inputs": [
      {
        "name": "ytId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "totalIdleAssets",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable",
    "natspec": "Function executeAllocation"
  },
  {
    "name": "registerNewStrategy",
    "inputs": [
      {
        "name": "ytId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "strategyId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable",
    "natspec": "Function registerNewStrategy"
  },
  {
    "name": "vote",
    "inputs": [
      {
        "name": "ytId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "strategyIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "weights",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable",
    "natspec": "Function vote"
  }
],
  };
