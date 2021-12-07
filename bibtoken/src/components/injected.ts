import { InjectedConnector } from "@web3-react/injected-connector";

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 1887],
  // supportedChainIds: [1887],
});

export { injected };
