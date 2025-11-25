import { useState } from "react";
import { useWallet } from "@/context/wallet-context";
import { connectMetaMask } from "@/utilities/wallet";
import { Wallet } from "lucide-react";

const ConnectWalletModal = ({ onClose }: { onClose: () => void }) => {
  const { account, setAccount } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setError(null);
    setConnecting(true);
    try {
      const acc = await connectMetaMask();
      setAccount(acc);
    } catch (err: unknown) {
      const { message, code } = err as { message?: string; code?: number };
      if (message === "MetaMask is not installed") {
        setError("Please install MetaMask from https://metamask.io/");
      } else if (code === 4001) {
        setError("Connection request rejected.");
      } else {
        setError("Failed to connect wallet.");
      }
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div
      className="modal"
      style={{
        position: "fixed",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        background: "white",
        padding: "20px",
        borderRadius: 8,
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
      }}
    >
      <button onClick={onClose} style={{ float: "right" }}>
        X
      </button>
      {account ? (
        <div>
          Connected Wallet:
          <br />
          <strong>{account}</strong>
        </div>
      ) : (
        <>
          <button onClick={handleConnect} disabled={connecting}>
            {connecting ? "Connecting..." : "Connect MetaMask"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}
    </div>
  );
};

export const ConnectWalletButton = () => {
  const { account } = useWallet();
  const [modalOpen, setModalOpen] = useState(false);

  const shortAccount = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : null;

  return (
    <>
      <button
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
          account
            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            : "bg-gradient-to-r from-blue-600 to-emerald-500 text-white hover:from-blue-700 hover:to-emerald-600 shadow-lg hover:shadow-xl transform hover:scale-105"
        }`}
        onClick={() => setModalOpen(true)}
      >
        <Wallet className="w-4 h-4" />
        <span className="hidden sm:block">
          {shortAccount || "Connect Wallet"}
        </span>
      </button>
      {modalOpen && (
        <ConnectWalletModal
          onClose={() => {
            setModalOpen(false);
          }}
        />
      )}
    </>
  );
};
