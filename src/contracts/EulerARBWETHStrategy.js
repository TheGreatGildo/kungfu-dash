// Auto-generated contract library
// This file is generated from compiled Solidity contracts and their NatSpec comments

export const EulerARBWETHStrategy = {
    name: "EulerARBWETHStrategy",
    title: "EulerARBWETHStrategy",
    notice: "This strategy is used to allocate and deallocate weth to the Euler WETH vault on ARB",
    abi: [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_myt",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_params",
        "type": "tuple",
        "internalType": "struct IMYTStrategy.StrategyParams",
        "components": [
          {
            "name": "owner",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "name",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "protocol",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "riskClass",
            "type": "uint8",
            "internalType": "enum IMYTStrategy.RiskClass"
          },
          {
            "name": "cap",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "globalCap",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "estimatedYield",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "additionalIncentives",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "slippageBPS",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "name": "_weth",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_eulerVault",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_permit2Address",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "FIXED_POINT_SCALAR",
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
    "name": "MIN_SNAPSHOT_INTERVAL",
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
    "name": "MYT",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IVaultV2"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "SECONDS_PER_YEAR",
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
    "name": "adapterId",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "allocate",
    "inputs": [
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "assets",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "selector",
        "type": "bytes4",
        "internalType": "bytes4"
      },
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "strategyIds",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      },
      {
        "name": "change",
        "type": "int256",
        "internalType": "int256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "claimRewards",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "claimWithdrawalQueue",
    "inputs": [
      {
        "name": "positionId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "ret",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "deallocate",
    "inputs": [
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "assets",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "selector",
        "type": "bytes4",
        "internalType": "bytes4"
      },
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "strategyIds",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      },
      {
        "name": "change",
        "type": "int256",
        "internalType": "int256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "estApr",
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
    "name": "estApy",
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
    "name": "getCap",
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
    "name": "getEstimatedYield",
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
    "name": "getGlobalCap",
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
    "name": "getIdData",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ids",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isValidSignature",
    "inputs": [
      {
        "name": "_hash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_signature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "killSwitch",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "lastIndex",
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
    "name": "lastSnapshotTime",
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
    "name": "owner",
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
    "name": "params",
    "inputs": [],
    "outputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "protocol",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "riskClass",
        "type": "uint8",
        "internalType": "enum IMYTStrategy.RiskClass"
      },
      {
        "name": "cap",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "globalCap",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "estimatedYield",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "additionalIncentives",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "slippageBPS",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "permit2Address",
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
    "name": "previewAdjustedWithdraw",
    "inputs": [
      {
        "name": "amount",
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
    "name": "realAssets",
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
    "name": "receiptToken",
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
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setAdditionalIncentives",
    "inputs": [
      {
        "name": "newValue",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setKillSwitch",
    "inputs": [
      {
        "name": "val",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setPermit2Address",
    "inputs": [
      {
        "name": "newAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setRiskClass",
    "inputs": [
      {
        "name": "newClass",
        "type": "uint8",
        "internalType": "enum IMYTStrategy.RiskClass"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setWhitelistedAllocator",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "val",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "slippageBPS",
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
    "name": "snapshotYield",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "vault",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IERC4626"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "weth",
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
    "type": "function",
    "name": "whitelistedAllocators",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "Allocate",
    "inputs": [
      {
        "name": "amount",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "strategy",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Deallocate",
    "inputs": [
      {
        "name": "amount",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "strategy",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "DeallocateDex",
    "inputs": [
      {
        "name": "amount",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Emergency",
    "inputs": [
      {
        "name": "isEmergency",
        "type": "bool",
        "indexed": true,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "IncentivesUpdated",
    "inputs": [
      {
        "name": "enabled",
        "type": "bool",
        "indexed": true,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RiskClassUpdated",
    "inputs": [
      {
        "name": "class",
        "type": "uint8",
        "indexed": true,
        "internalType": "enum IMYTStrategy.RiskClass"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "StrategyAllocationLoss",
    "inputs": [
      {
        "name": "message",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "amountRequested",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "actualAmountReceived",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "StrategyDeallocationLoss",
    "inputs": [
      {
        "name": "message",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "amountRequested",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "actualAmountSent",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "YieldUpdated",
    "inputs": [
      {
        "name": "yield",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "CounterfeitSettler",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20CallFailed",
    "inputs": [
      {
        "name": "target",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "success",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
],
    viewFunctions: [
  {
    "name": "FIXED_POINT_SCALAR",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function FIXED_POINT_SCALAR"
  },
  {
    "name": "MIN_SNAPSHOT_INTERVAL",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function MIN_SNAPSHOT_INTERVAL"
  },
  {
    "name": "MYT",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IVaultV2"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function MYT"
  },
  {
    "name": "SECONDS_PER_YEAR",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function SECONDS_PER_YEAR"
  },
  {
    "name": "adapterId",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function adapterId"
  },
  {
    "name": "estApr",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function estApr"
  },
  {
    "name": "estApy",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function estApy"
  },
  {
    "name": "getCap",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function getCap"
  },
  {
    "name": "getEstimatedYield",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function getEstimatedYield"
  },
  {
    "name": "getGlobalCap",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function getGlobalCap"
  },
  {
    "name": "getIdData",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function getIdData"
  },
  {
    "name": "ids",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function ids"
  },
  {
    "name": "isValidSignature",
    "inputs": [
      {
        "name": "_hash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_signature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function isValidSignature"
  },
  {
    "name": "killSwitch",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function killSwitch"
  },
  {
    "name": "lastIndex",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function lastIndex"
  },
  {
    "name": "lastSnapshotTime",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function lastSnapshotTime"
  },
  {
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function owner"
  },
  {
    "name": "params",
    "inputs": [],
    "outputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "protocol",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "riskClass",
        "type": "uint8",
        "internalType": "enum IMYTStrategy.RiskClass"
      },
      {
        "name": "cap",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "globalCap",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "estimatedYield",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "additionalIncentives",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "slippageBPS",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function params"
  },
  {
    "name": "permit2Address",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function permit2Address"
  },
  {
    "name": "previewAdjustedWithdraw",
    "inputs": [
      {
        "name": "amount",
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
    "natspec": "Function previewAdjustedWithdraw"
  },
  {
    "name": "realAssets",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function realAssets"
  },
  {
    "name": "receiptToken",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function receiptToken"
  },
  {
    "name": "slippageBPS",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function slippageBPS"
  },
  {
    "name": "vault",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IERC4626"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function vault"
  },
  {
    "name": "weth",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IERC20"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function weth"
  },
  {
    "name": "whitelistedAllocators",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view",
    "natspec": "Function whitelistedAllocators"
  }
],
    writeFunctions: [
  {
    "name": "allocate",
    "inputs": [
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "assets",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "selector",
        "type": "bytes4",
        "internalType": "bytes4"
      },
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "strategyIds",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      },
      {
        "name": "change",
        "type": "int256",
        "internalType": "int256"
      }
    ],
    "stateMutability": "nonpayable",
    "natspec": "Function allocate"
  },
  {
    "name": "claimRewards",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "natspec": "Function claimRewards"
  },
  {
    "name": "claimWithdrawalQueue",
    "inputs": [
      {
        "name": "positionId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "ret",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "natspec": "Function claimWithdrawalQueue"
  },
  {
    "name": "deallocate",
    "inputs": [
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "assets",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "selector",
        "type": "bytes4",
        "internalType": "bytes4"
      },
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "strategyIds",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      },
      {
        "name": "change",
        "type": "int256",
        "internalType": "int256"
      }
    ],
    "stateMutability": "nonpayable",
    "natspec": "Function deallocate"
  },
  {
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable",
    "natspec": "Function renounceOwnership"
  },
  {
    "name": "setAdditionalIncentives",
    "inputs": [
      {
        "name": "newValue",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable",
    "natspec": "Function setAdditionalIncentives"
  },
  {
    "name": "setKillSwitch",
    "inputs": [
      {
        "name": "val",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable",
    "natspec": "Function setKillSwitch"
  },
  {
    "name": "setPermit2Address",
    "inputs": [
      {
        "name": "newAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable",
    "natspec": "Function setPermit2Address"
  },
  {
    "name": "setRiskClass",
    "inputs": [
      {
        "name": "newClass",
        "type": "uint8",
        "internalType": "enum IMYTStrategy.RiskClass"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable",
    "natspec": "Function setRiskClass"
  },
  {
    "name": "setWhitelistedAllocator",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "val",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable",
    "natspec": "Function setWhitelistedAllocator"
  },
  {
    "name": "snapshotYield",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "natspec": "Function snapshotYield"
  },
  {
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
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
