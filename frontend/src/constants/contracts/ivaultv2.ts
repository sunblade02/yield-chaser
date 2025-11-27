export const contractABI = [
{
    "inputs": [],
    "name": "DOMAIN_SEPARATOR",
    "outputs": [
    {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "_totalAssets",
    "outputs": [
    {
        "internalType": "uint128",
        "name": "",
        "type": "uint128"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "bytes4",
        "name": "selector",
        "type": "bytes4"
    }
    ],
    "name": "abdicate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "bytes4",
        "name": "selector",
        "type": "bytes4"
    }
    ],
    "name": "abdicated",
    "outputs": [
    {
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
    }
    ],
    "name": "absoluteCap",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "accrueInterest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "accrueInterestView",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "newTotalAssets",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "performanceFeeShares",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "managementFeeShares",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "adapterRegistry",
    "outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
    }
    ],
    "name": "adapters",
    "outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "adaptersLength",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "account",
        "type": "address"
    }
    ],
    "name": "addAdapter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "adapter",
        "type": "address"
    },
    {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
    },
    {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
    }
    ],
    "name": "allocate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
    }
    ],
    "name": "allocation",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "owner",
        "type": "address"
    },
    {
        "internalType": "address",
        "name": "spender",
        "type": "address"
    }
    ],
    "name": "allowance",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "spender",
        "type": "address"
    },
    {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
    }
    ],
    "name": "approve",
    "outputs": [
    {
        "internalType": "bool",
        "name": "success",
        "type": "bool"
    }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "asset",
    "outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "account",
        "type": "address"
    }
    ],
    "name": "balanceOf",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "account",
        "type": "address"
    }
    ],
    "name": "canReceiveAssets",
    "outputs": [
    {
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "account",
        "type": "address"
    }
    ],
    "name": "canReceiveShares",
    "outputs": [
    {
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "account",
        "type": "address"
    }
    ],
    "name": "canSendAssets",
    "outputs": [
    {
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "account",
        "type": "address"
    }
    ],
    "name": "canSendShares",
    "outputs": [
    {
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
    }
    ],
    "name": "convertToAssets",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
    }
    ],
    "name": "convertToShares",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "curator",
    "outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "adapter",
        "type": "address"
    },
    {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
    },
    {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
    }
    ],
    "name": "deallocate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "decimals",
    "outputs": [
    {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "bytes",
        "name": "idData",
        "type": "bytes"
    },
    {
        "internalType": "uint256",
        "name": "newAbsoluteCap",
        "type": "uint256"
    }
    ],
    "name": "decreaseAbsoluteCap",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "bytes",
        "name": "idData",
        "type": "bytes"
    },
    {
        "internalType": "uint256",
        "name": "newRelativeCap",
        "type": "uint256"
    }
    ],
    "name": "decreaseRelativeCap",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "bytes4",
        "name": "selector",
        "type": "bytes4"
    },
    {
        "internalType": "uint256",
        "name": "newDuration",
        "type": "uint256"
    }
    ],
    "name": "decreaseTimelock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
    },
    {
        "internalType": "address",
        "name": "onBehalf",
        "type": "address"
    }
    ],
    "name": "deposit",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
    }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
    }
    ],
    "name": "executableAt",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "firstTotalAssets",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "adapter",
        "type": "address"
    },
    {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
    },
    {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
    },
    {
        "internalType": "address",
        "name": "onBehalf",
        "type": "address"
    }
    ],
    "name": "forceDeallocate",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "penaltyShares",
        "type": "uint256"
    }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "adapter",
        "type": "address"
    }
    ],
    "name": "forceDeallocatePenalty",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "bytes",
        "name": "idData",
        "type": "bytes"
    },
    {
        "internalType": "uint256",
        "name": "newAbsoluteCap",
        "type": "uint256"
    }
    ],
    "name": "increaseAbsoluteCap",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "bytes",
        "name": "idData",
        "type": "bytes"
    },
    {
        "internalType": "uint256",
        "name": "newRelativeCap",
        "type": "uint256"
    }
    ],
    "name": "increaseRelativeCap",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "bytes4",
        "name": "selector",
        "type": "bytes4"
    },
    {
        "internalType": "uint256",
        "name": "newDuration",
        "type": "uint256"
    }
    ],
    "name": "increaseTimelock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "account",
        "type": "address"
    }
    ],
    "name": "isAdapter",
    "outputs": [
    {
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "account",
        "type": "address"
    }
    ],
    "name": "isAllocator",
    "outputs": [
    {
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "account",
        "type": "address"
    }
    ],
    "name": "isSentinel",
    "outputs": [
    {
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "lastUpdate",
    "outputs": [
    {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "liquidityAdapter",
    "outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "liquidityData",
    "outputs": [
    {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "managementFee",
    "outputs": [
    {
        "internalType": "uint96",
        "name": "",
        "type": "uint96"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "managementFeeRecipient",
    "outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "onBehalf",
        "type": "address"
    }
    ],
    "name": "maxDeposit",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "onBehalf",
        "type": "address"
    }
    ],
    "name": "maxMint",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "maxRate",
    "outputs": [
    {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "onBehalf",
        "type": "address"
    }
    ],
    "name": "maxRedeem",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "onBehalf",
        "type": "address"
    }
    ],
    "name": "maxWithdraw",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
    },
    {
        "internalType": "address",
        "name": "onBehalf",
        "type": "address"
    }
    ],
    "name": "mint",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
    }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "bytes[]",
        "name": "data",
        "type": "bytes[]"
    }
    ],
    "name": "multicall",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "name",
    "outputs": [
    {
        "internalType": "string",
        "name": "",
        "type": "string"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "owner",
        "type": "address"
    }
    ],
    "name": "nonces",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "owner",
    "outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "performanceFee",
    "outputs": [
    {
        "internalType": "uint96",
        "name": "",
        "type": "uint96"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "performanceFeeRecipient",
    "outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "owner",
        "type": "address"
    },
    {
        "internalType": "address",
        "name": "spender",
        "type": "address"
    },
    {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
    },
    {
        "internalType": "uint8",
        "name": "v",
        "type": "uint8"
    },
    {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
    },
    {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
    }
    ],
    "name": "permit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
    }
    ],
    "name": "previewDeposit",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
    }
    ],
    "name": "previewMint",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
    }
    ],
    "name": "previewRedeem",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
    }
    ],
    "name": "previewWithdraw",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "receiveAssetsGate",
    "outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "receiveSharesGate",
    "outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
    },
    {
        "internalType": "address",
        "name": "onBehalf",
        "type": "address"
    },
    {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
    }
    ],
    "name": "redeem",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
    }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
    }
    ],
    "name": "relativeCap",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "account",
        "type": "address"
    }
    ],
    "name": "removeAdapter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
    }
    ],
    "name": "revoke",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "sendAssetsGate",
    "outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "sendSharesGate",
    "outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "newAdapterRegistry",
        "type": "address"
    }
    ],
    "name": "setAdapterRegistry",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "newCurator",
        "type": "address"
    }
    ],
    "name": "setCurator",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "adapter",
        "type": "address"
    },
    {
        "internalType": "uint256",
        "name": "newForceDeallocatePenalty",
        "type": "uint256"
    }
    ],
    "name": "setForceDeallocatePenalty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "account",
        "type": "address"
    },
    {
        "internalType": "bool",
        "name": "newIsAllocator",
        "type": "bool"
    }
    ],
    "name": "setIsAllocator",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "account",
        "type": "address"
    },
    {
        "internalType": "bool",
        "name": "isSentinel",
        "type": "bool"
    }
    ],
    "name": "setIsSentinel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "newLiquidityAdapter",
        "type": "address"
    },
    {
        "internalType": "bytes",
        "name": "newLiquidityData",
        "type": "bytes"
    }
    ],
    "name": "setLiquidityAdapterAndData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "newManagementFee",
        "type": "uint256"
    }
    ],
    "name": "setManagementFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "newManagementFeeRecipient",
        "type": "address"
    }
    ],
    "name": "setManagementFeeRecipient",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "newMaxRate",
        "type": "uint256"
    }
    ],
    "name": "setMaxRate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "string",
        "name": "newName",
        "type": "string"
    }
    ],
    "name": "setName",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
    }
    ],
    "name": "setOwner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "newPerformanceFee",
        "type": "uint256"
    }
    ],
    "name": "setPerformanceFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "newPerformanceFeeRecipient",
        "type": "address"
    }
    ],
    "name": "setPerformanceFeeRecipient",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "newReceiveAssetsGate",
        "type": "address"
    }
    ],
    "name": "setReceiveAssetsGate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "newReceiveSharesGate",
        "type": "address"
    }
    ],
    "name": "setReceiveSharesGate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "newSendAssetsGate",
        "type": "address"
    }
    ],
    "name": "setSendAssetsGate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "newSendSharesGate",
        "type": "address"
    }
    ],
    "name": "setSendSharesGate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "string",
        "name": "newSymbol",
        "type": "string"
    }
    ],
    "name": "setSymbol",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
    }
    ],
    "name": "submit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "symbol",
    "outputs": [
    {
        "internalType": "string",
        "name": "",
        "type": "string"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "bytes4",
        "name": "selector",
        "type": "bytes4"
    }
    ],
    "name": "timelock",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "totalAssets",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "to",
        "type": "address"
    },
    {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
    }
    ],
    "name": "transfer",
    "outputs": [
    {
        "internalType": "bool",
        "name": "success",
        "type": "bool"
    }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "from",
        "type": "address"
    },
    {
        "internalType": "address",
        "name": "to",
        "type": "address"
    },
    {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
    }
    ],
    "name": "transferFrom",
    "outputs": [
    {
        "internalType": "bool",
        "name": "success",
        "type": "bool"
    }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "virtualShares",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256"
    },
    {
        "internalType": "address",
        "name": "onBehalf",
        "type": "address"
    },
    {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
    }
    ],
    "name": "withdraw",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
    }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
}
];