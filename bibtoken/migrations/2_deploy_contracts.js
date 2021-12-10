const BibToken = artifacts.require("BibToken");
const BuySell  = artifacts.require("BuySell")

module.exports =async function(deployer,network,accounts) {
   await deployer.deploy(BibToken);
   const bibToken = await BibToken.deployed();
   await deployer.deploy(BuySell,bibToken.address);
  
  
  const buySell = await BuySell.deployed();
  await bibToken.approve(buySell.address,"1000000000000000000000000");
  await bibToken.transfer(buySell.address,"1000000000000000000000000");
  
  console.log("Buy sell contract has all the total supply.");
};
