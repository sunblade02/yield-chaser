// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IVaultV2 } from "./morpho-org/vault-v2/src/interfaces/IVaultV2.sol"; 
import { IYcAccount } from "./IYcAccount.sol";
import { YcFactory } from "./YcFactory.sol";
import { IYcFactory } from "./IYcFactory.sol";
import { IYcStrategy } from "./IYcStrategy.sol";
import { YcToken } from "./YcToken.sol";

/// @title Yield Chaser registry
/// @author Jérémie Riquier
/// @notice This smart contract centralizes the data from the Yield Chaser DApp : factory, token, accounts, strategies.
contract YcRegistry is AccessControl {

    //----- ERRORS -----//

    error NotStrategyOwner();
    error NotAllowedStrategy();
    error AccountAlreadyExists();
    error ETHTransferFailed();
    event ETHReceived(address sender, uint amount);

    //----- EVENTS -----//

    event StrategyAdded(IYcStrategy strategy);
    event AccountCreated(address indexed owner, IYcStrategy strategy, uint usdcAmount, uint ethAmount);

    //----- STATE VARIABLES -----//

    bytes32 public constant BOT_ROLE = keccak256("BOT_ROLE");

    IYcFactory public factory;

    YcToken public yct;

    ERC20 public usdc;

    /// @dev Stores the association between an user address and his account.
    mapping(address => IYcAccount) public accounts;

    IYcStrategy[] public strategies;

    mapping(IYcStrategy => bool) public allowedStrategies;

    //----- FUNCTIONS -----//
    
    constructor(ERC20 _usdc) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        usdc = _usdc;
        factory = new YcFactory();
        yct = new YcToken();
    }

    /// @notice Adds a strategy to the registry.
    /// This function can only be called by admin.
    /// The strategy must be owned by the registry.
    function addStrategy(IYcStrategy _strategy) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(Ownable(address(_strategy)).owner() == address(this), NotStrategyOwner());

        strategies.push(_strategy);
        allowedStrategies[_strategy] = true;

        emit StrategyAdded(_strategy);
    }

    /// @notice Creates a new account to the registry.
    /// Transfers ETH to the account.
    /// Attempts to Transfer USDC to the highest performing yield vault according to the selected strategy.
    /// Mints 1 YCT and transfers it to the account.
    function createAccount(IYcStrategy _strategy, uint _amount) payable external returns (IYcAccount) {
        require(allowedStrategies[_strategy], NotAllowedStrategy());
        require(address(accounts[msg.sender]) == address(0), AccountAlreadyExists());
        
        IYcAccount account = factory.createAccount(usdc, _strategy, msg.sender);
        accounts[msg.sender] = account;

        if (msg.value > 0) {
            (bool success, ) = address(account).call{value: msg.value}("");
            require(success, ETHTransferFailed());
        }

        if (_amount > 0) {
            usdc.transferFrom(msg.sender, address(account), _amount);
            try account.allocate() {} catch {}
        }

        yct.mint(address(account), 10**18);

        emit AccountCreated(msg.sender, _strategy, _amount, msg.value);

        return account;
    }

    /// @notice Grants the role `BOT ROLE` to an address
    /// This function can only be called by admin.
    function grantBotRole(address _account) external onlyRole(DEFAULT_ADMIN_ROLE) returns (bool) {
        return _grantRole(BOT_ROLE, _account);
    }
    
    /// @notice Revokes the role `BOT ROLE` from an address
    /// This function can only be called by admin.
    function revokeBotRole(address _account) external onlyRole(DEFAULT_ADMIN_ROLE) returns (bool) {
        return _revokeRole(BOT_ROLE, _account);
    }

    receive() payable external {
        emit ETHReceived(msg.sender, msg.value);
    }
}