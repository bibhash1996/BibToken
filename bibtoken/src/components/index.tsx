import React from "react";
import { Button } from "antd";
import { Typography, Card, Avatar, Tag, Popover } from "antd";
import MetamaskImg from "../metamask.png";
import "./styles.css";
import "antd/dist/antd.css";
import { useWeb3React } from "@web3-react/core";
import { useEagerConnect, useInactiveListener } from "./hook";
import { injected } from "./injected";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Web3 from "web3";

// ABI's
const BibTokenJSON = require("../abis/BibToken.json");
const BuySellJSON = require("../abis/BuySell.json");

const { Meta } = Card;

export default function Home() {
  const { active, account, library, connector, activate, deactivate } =
    useWeb3React();
  const [currentBibToken, setCurrentBibToken] = React.useState(0);

  const getBalance = async () => {
    const web3: Web3 = library;
    const nwId = await web3.eth.net.getId();
    const bibTokenContractData = BibTokenJSON.networks[nwId];

    if (bibTokenContractData) {
      const contract = new web3.eth.Contract(
        BibTokenJSON.abi,
        bibTokenContractData.address
      );
      console.log("ACCOUNT : ", account);
      const balance = await contract.methods.balanceOf(account).call();
      console.log("BALANCE : ", web3.utils.fromWei(`${balance}`, "ether"));
      setCurrentBibToken(web3.utils.fromWei(`${balance}`, "ether") as any);
    }
  };

  React.useEffect(() => {
    if (active && library) {
      getBalance().then().catch();
    }
  }, [active]);

  React.useEffect(() => {
    if (library) watchEvents(library).catch(console.error);
  }, [library]);

  const watchEvents = async (web3: Web3) => {
    if (!web3) return;
    const nwId = await web3.eth.net.getId();
    console.log("Network id ecent:  ", nwId);
    const contractData = BuySellJSON.networks[nwId];

    if (contractData) {
      const contract = new web3.eth.Contract(
        BuySellJSON.abi,
        contractData.address
      );
      contract.events
        .BuyTokens({ buyer: account })
        .on("data", function (event: any) {
          console.log("Event in data");
          console.log(event); // same results as the optional callback above
        })
        .on("changed", function () {})
        .on("error", console.error);
    }
  };

  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);

  const connect = async () => {
    console.log("CONNECT");
    try {
      await activate(injected);
      console.log("CONNECTED");
    } catch (error) {}
  };

  const buyBibToken = async () => {
    if (!library) return;
    const web3: Web3 = library;
    const nwId = await web3.eth.net.getId();

    const buySellTokenContractData = BuySellJSON.networks[nwId];

    if (buySellTokenContractData) {
      const contract = new web3.eth.Contract(
        BuySellJSON.abi,
        buySellTokenContractData.address
      );
      console.log("BUY SELL ");
      //   const response = await contract.methods.buyTokens().call({ value: 2 });
      const response = await contract.methods
        .buyTokens()
        .send({ from: account, value: web3.utils.toWei("2", "ether") });
      console.log("BUY RESPONSE : ", response);
    }
  };

  return (
    <div className={"root"}>
      <div className="header">
        <div>
          <Tag color={active ? "green" : "red"}>
            {active ? "Connected" : "Disconnected"}
          </Tag>
        </div>
        <Button
          type="ghost"
          className={"metamask-btn"}
          onClick={connect}
          disabled={active}
        >
          <img
            src={MetamaskImg}
            alt="metamask"
            style={{ height: 30, width: 30 }}
          />
          <Typography.Text style={{ marginLeft: 10, color: "inherit" }}>
            Connect with metamask
          </Typography.Text>
        </Button>
      </div>
      <div className={"body"}>
        <Card
          style={{ width: 300 }}
          cover={
            <img
              alt="bib"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
          }
          actions={[
            <Button type="ghost" onClick={buyBibToken}>
              Buy BIB token
            </Button>,
            <Button type="ghost">Sell BIB token</Button>,
          ]}
        >
          <Meta
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
            title="Current BIB Tokens"
            description={`${currentBibToken} BIB`}
          />
        </Card>
      </div>
    </div>
  );
}
