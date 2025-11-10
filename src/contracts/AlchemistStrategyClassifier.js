// Auto-generated contract library
// This file is generated from compiled Solidity contracts and their NatSpec comments

export const AlchemistStrategyClassifier = {
    name: "AlchemistStrategyClassifier",
    title: "AlchemistStrategyClassifier",
    notice: "This contract is used to classify strategies based on their risk level and set the respective caps",
    abi: [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_admin",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "acceptOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "admin",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "assignStrategyRiskLevel",
    "inputs": [
      {
        "name": "strategyId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "riskLevel",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getGlobalCap",
    "inputs": [
      {
        "name": "riskLevel",
        "type": "uint8",
        "internalType": "uint8"
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
    "name": "getIndividualCap",
    "inputs": [
      {
        "name": "strategyId",
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
    "name": "getStrategyRiskLevel",
    "inputs": [
      {
        "name": "strategyId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "pendingAdmin",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "riskClasses",
    "inputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "outputs": [
      {
        "name": "globalCap",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "localCap",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "setRiskClass",
    "inputs": [
      {
        "name": "classId",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "globalCap",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "localCap",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "strategyRiskLevel",
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
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "_newAdmin",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "AdminChanged",
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
    "name": "RiskClassModified",
    "inputs": [
      {
        "name": "class",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "globalCap",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "localCap",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
],
    viewFunctions: [
  {
    "name": "admin",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function admin"
  },
  {
    "name": "getGlobalCap",
    "inputs": [
      {
        "name": "riskLevel",
        "type": "uint8",
        "internalType": "uint8"
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
    "natspec": "@notice Returns the maximum allowed combined allocation for all strategies in a risk class"
  },
  {
    "name": "getIndividualCap",
    "inputs": [
      {
        "name": "strategyId",
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
    "natspec": "@notice Returns the maximum allowed allocation for a single strategy"
  },
  {
    "name": "getStrategyRiskLevel",
    "inputs": [
      {
        "name": "strategyId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "stateMutability": "view",
    "natspec": "@notice Returns the risk level of a given strategy"
  },
  {
    "name": "pendingAdmin",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function pendingAdmin"
  },
  {
    "name": "riskClasses",
    "inputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "outputs": [
      {
        "name": "globalCap",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "localCap",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function riskClasses"
  },
  {
    "name": "strategyRiskLevel",
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
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function strategyRiskLevel"
  }
],
    writeFunctions: [
  {
    "name": "acceptOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable",
    "natspec": "Function acceptOwnership"
  },
  {
    "name": "assignStrategyRiskLevel",
    "inputs": [
      {
        "name": "strategyId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "riskLevel",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable",
    "natspec": "Function assignStrategyRiskLevel"
  },
  {
    "name": "setRiskClass",
    "inputs": [
      {
        "name": "classId",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "globalCap",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "localCap",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable",
    "natspec": "Function setRiskClass"
  },
  {
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "_newAdmin",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable",
    "natspec": "Function transferOwnership"
  }
],
  };
