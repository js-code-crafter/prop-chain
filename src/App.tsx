import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { Navbar } from "./components/Layout/Navbar";
import { HomePage } from "./pages/HomePage";
import { ListingsPage } from "./pages/ListingsPage";
import { PropertyDetailPage } from "./pages/PropertyDetailPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { useWallet, WalletProvider } from "./context/wallet-context";

const AppContent: React.FC = () => {
  const [walletError, setWalletError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState(["1", "4"]);
  const navigate = useNavigate();
  const walletAddress = useWallet();

  // Connect wallet function
  const handleConnectWallet = async () => {
    // Do something!
  };

  const handleToggleFavorite = (propertyId: string) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <>
      <Navbar
        onConnectWallet={handleConnectWallet}
        walletAddress={walletAddress.account}
      />
      {walletError && (
        <div className="fixed top-0 left-0 w-full z-50 bg-red-600 text-white p-4 text-center">
          {walletError}
          <button
            className="ml-4 text-white underline"
            onClick={() => setWalletError(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          }
        />
        <Route
          path="/listings"
          element={
            <ListingsPage
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          }
        />
        <Route
          path="/property/:id"
          element={
            <PropertyDetailPage onToggleFavorite={handleToggleFavorite} />
          }
        />
        <Route
          path="/favorites"
          element={
            <FavoritesPage
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <DashboardPage
              walletConnected={walletAddress !== null}
              onConnectWallet={handleConnectWallet}
            />
          }
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <WalletProvider>
      <Router>
        <AppContent />
      </Router>
    </WalletProvider>
  );
}

export default App;
