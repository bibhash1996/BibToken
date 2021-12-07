pragma solidity ^0.8.0;

import "./BibToken.sol";

contract BuySell {
    BibToken bibToken;
    address owner;
    // token price for ETH
    uint256 public tokensPerEth = 100;

    // Event that logs buy operation
    event BuyTokens(address buyer, uint256 amountOfETH, uint256 amountOfTokens);

    constructor() {
        bibToken = new BibToken();
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only admin can withdraw");
        _;
    }

    function buyTokens() public payable returns (uint256) {
        require(msg.value > 0, "Insufficient ETH sent.");
        uint256 amountToBuy = msg.value * tokensPerEth;
        uint256 vendorBalance = bibToken.balanceOf(address(this));
        require(vendorBalance > amountToBuy, "Insufficient tokens");
        bool sent = bibToken.transfer(msg.sender, amountToBuy);
        require(sent, "Error transferring token");
        emit BuyTokens(msg.sender, msg.value, amountToBuy);
        return amountToBuy;
    }

    function withdraw() public onlyOwner {
        uint256 ownerBalance = address(this).balance;
        require(ownerBalance > 0, "Owner has not balance to withdraw");

        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Failed to send user balance back to the owner");
    }
}
