interface EthereumProvider {
  isMetaMask?: boolean;

  request: (args: {
    method: string;
    params?: unknown[] | unknown;
  }) => Promise<string[]>;
}

interface WindowWithEthereum extends Window {
  ethereum?: EthereumProvider;
}

declare const window: WindowWithEthereum;

export async function connectMetaMask(): Promise<string> {
  const ethereum = (window as WindowWithEthereum).ethereum;
  if (!ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const accounts: string[] = await ethereum.request({
    method: "eth_requestAccounts",
  });
  if (accounts.length === 0) {
    throw new Error("No accounts found");
  }
  return accounts[0];
}
