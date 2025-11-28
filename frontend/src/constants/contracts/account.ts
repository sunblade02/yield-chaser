export const contractABI = [
{
    "inputs": [
    {
        "internalType": "contract ERC20",
        "name": "_usdc",
        "type": "address"
    },
    {
        "internalType": "contract IYcStrategy",
        "name": "_strategy",
        "type": "address"
    },
    {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
    }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
},
{
    "inputs": [],
    "name": "NoVault",
    "type": "error"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "owner",
        "type": "address"
    }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "account",
        "type": "address"
    }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "internalType": "address",
        "name": "sender",
        "type": "address"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    }
    ],
    "name": "ETHReceived",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
    },
    {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
    }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
    },
    {
        "indexed": false,
        "internalType": "contract IVaultV2",
        "name": "vault",
        "type": "address"
    }
    ],
    "name": "USDCAllocated",
    "type": "event"
},
{
    "inputs": [],
    "name": "allocate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "currentVault",
    "outputs": [
    {
        "internalType": "contract IVaultV2",
        "name": "",
        "type": "address"
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
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "strategy",
    "outputs": [
    {
        "internalType": "contract IYcStrategy",
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
        "name": "newOwner",
        "type": "address"
    }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "usdc",
    "outputs": [
    {
        "internalType": "contract ERC20",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "stateMutability": "payable",
    "type": "receive"
}
];