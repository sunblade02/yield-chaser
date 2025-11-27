// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { IMockERC20 } from "./IMockERC20.sol";

contract MockMorphoVault {
    error CannotReceiveShares();
    error CannotSendShares();
    error TransferFromReverted();
    error TransferReverted();

    string public name;
    string public symbol;
    address public asset;
    uint public totalCapital;
    uint256 public _totalAssets;
    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    /// @dev Fee rate = fee / 18
    uint96 public performanceFee; 
    uint96 public managementFee;

    constructor(string memory _name, string memory _symbol, address _asset, uint96 _managementFee, uint96 _performanceFee) {
        name = _name;
        symbol = _symbol;
        asset = _asset;
        managementFee = _managementFee;
        performanceFee = _performanceFee;
    }

    function deposit(uint256 assets, address onBehalf) external returns (uint256) {
        require(onBehalf != address(0), CannotReceiveShares());

        uint256 shares = previewDeposit(assets);
    
        bool success = IMockERC20(asset).transferFrom(msg.sender, address(this), assets);
        require(success, TransferFromReverted());

        balanceOf[onBehalf] += shares;
        totalSupply += shares;
        totalCapital += assets;
        _totalAssets += assets;

        return shares;
    }

    function previewDeposit(uint256 assets) public view returns (uint256 shares) {
        return previewWithdraw(assets);
    }

    function withdraw(uint256 assets, address receiver, address onBehalf) external returns (uint256) {
        uint256 shares = previewWithdraw(assets);
        exit(assets, shares, receiver, onBehalf);
        return shares;
    }

    function previewWithdraw(uint256 assets) public view returns (uint256 shares) {
        return _totalAssets == 0 ? assets : (assets * totalSupply) / _totalAssets;
    }

    function redeem(uint256 shares, address receiver, address onBehalf) external returns (uint256) {
        uint256 assetsOut = previewRedeem(shares);
        exit(assetsOut, shares, receiver, onBehalf);
        return assetsOut;
    }

    function previewRedeem(uint256 shares) public view returns (uint256 assets) {
        return _totalAssets == 0 ? shares : (shares * _totalAssets) / totalSupply;
    }

    function exit(uint assets, uint shares, address receiver, address onBehalf) internal {
        require(balanceOf[onBehalf] >= shares, CannotSendShares());

        uint capitalPart = shares * totalCapital / totalSupply;
        uint interest = assets > capitalPart ? assets - capitalPart : 0;

        uint managementFeeAmount = (interest * managementFee) / 10**18;
        uint performanceFeeAmount = (interest * performanceFee) / 10**18;

        uint netAssets = assets - managementFeeAmount - performanceFeeAmount;

        balanceOf[onBehalf] -= shares;
        totalSupply -= shares;
        _totalAssets -= assets;
        totalCapital -= capitalPart;

        bool success = IMockERC20(asset).transfer(receiver, netAssets);
        require(success, TransferReverted());
    }

    function incAssets(uint amount) external {
        _totalAssets += amount;
        IMockERC20(asset).faucet(address(this), amount);
    }
}