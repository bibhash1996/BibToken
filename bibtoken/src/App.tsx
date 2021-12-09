import React from "react";
import Index from "./components";
import {
  Web3ReactProvider,
  useWeb3React,
  UnsupportedChainIdError,
} from "@web3-react/core";
import Web3 from "web3";

function App() {
  return (
    <div className="App">
      <Index />
    </div>
  );
}

export default function NApp() {
  return (
    <Web3ReactProvider
      getLibrary={(provider) => {
        return new Web3(provider);
      }}
    >
      <App />
    </Web3ReactProvider>
  );
}
