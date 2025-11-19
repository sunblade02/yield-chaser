// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { IMockERC20 } from "./IMockERC20.sol";

contract MockMorphoVault {
    error CannotReceiveShares();
    error CannotSendShares();
    error TransferFromReverted();
    error TransferReverted();

    address public asset;
    uint public totalCapital;
    uint256 public totalAssets;
    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    /// @dev Fee rate = fee / 1e18
    uint96 public performanceFee; 
    uint96 public managementFee;

    constructor(address _asset, uint96 _managementFee, uint96 _performanceFee) {
        asset = _asset;
        managementFee = _managementFee;
        performanceFee = _performanceFee;
    }

    function deposit(uint256 assets, address onBehalf) external returns (uint256) {
        require(onBehalf != address(0), CannotReceiveShares());

        uint256 shares = totalAssets == 0 ? assets : (assets * totalSupply) / totalAssets;
    
        bool success = IMockERC20(asset).transferFrom(msg.sender, address(this), assets);
        require(success, TransferFromReverted());

        balanceOf[onBehalf] += shares;
        totalSupply += shares;
        totalCapital += assets;
        totalAssets += assets;

        return shares;
    }

    function withdraw(uint256 assets, address receiver, address onBehalf) public returns (uint256) {
        uint256 shares = totalAssets == 0 ? assets : (assets * totalSupply) / totalAssets;
        exit(assets, shares, receiver, onBehalf);
        return shares;
    }

    function redeem(uint256 shares, address receiver, address onBehalf) external returns (uint256) {
        uint256 assetsOut = totalAssets == 0 ? shares : (shares * totalAssets) / totalSupply;
        exit(assetsOut, shares, receiver, onBehalf);
        return assetsOut;
    }

    function exit(uint assets, uint shares, address receiver, address onBehalf) internal {
        require(balanceOf[onBehalf] >= shares, CannotSendShares());

        uint capitalPart = shares * totalCapital / totalSupply;
        uint interest = assets > capitalPart ? assets - capitalPart : 0;

        uint managementFeeAmount = (interest * managementFee) / 1e18;
        uint performanceFeeAmount = (interest * performanceFee) / 1e18;

        uint netAssets = assets - managementFeeAmount - performanceFeeAmount;

        balanceOf[onBehalf] -= shares;
        totalSupply -= shares;
        totalAssets -= assets;
        totalCapital -= capitalPart;

        bool success = IMockERC20(asset).transfer(receiver, netAssets);
        require(success, TransferReverted());
    }

    function incAssets(uint amount) external {
        totalAssets += amount;
        IMockERC20(asset).faucet(address(this), amount);
    }
}