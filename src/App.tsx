import React, { useState } from "react";
import "./App.css";
import HealthStatus from "./components/HealthStatus";
import NetworkInfo from "./components/NetworkInfo";
import TransferTransaction from "./components/TransferTransaction";
import CreateAsset from "./components/CreateAsset";
import MintAsset from "./components/MintAsset";

function App() {
  const defaultBaseApiUrl = import.meta.env.VITE_BASE_API_URL || "";
  const defaultBlockchainId = import.meta.env.VITE_BLOCKCHAIN_ID || "";
  const [baseApiUrl, setBaseApiUrl] = useState<string>(defaultBaseApiUrl);
  const [blockchainId, setBlockchainId] = useState<string>(defaultBlockchainId);
  const [privateKey, setPrivateKey] = useState<string>(
    "323b1d8f4eed5f0da9da93071b034f2dce9d2d22692c172f3cb252a64ddfafd01b057de320297c29ad0c1f589ea216869cf1938d88c9fbd70d6748323dbf2fa7"
  );
  const [keyType, setKeyType] = useState<string>("ed25519");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div id="root">
      <h1>Nuklai SDK Demo App</h1>
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label>Base API URL:</label>
          <input
            type="text"
            value={baseApiUrl}
            onChange={(e) => setBaseApiUrl(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Blockchain ID:</label>
          <input
            type="text"
            value={blockchainId}
            onChange={(e) => setBlockchainId(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Private Key:</label>
          <input
            type="text"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Key Type:</label>
          <select value={keyType} onChange={(e) => setKeyType(e.target.value)}>
            <option value="bls">BLS</option>
            <option value="ed25519">ed25519</option>
          </select>
        </div>
        <button type="submit">Update</button>
      </form>
      <div className="card-container">
        <div className="card">
          <HealthStatus baseApiUrl={baseApiUrl} blockchainId={blockchainId} />
        </div>
        <div className="card">
          <NetworkInfo baseApiUrl={baseApiUrl} blockchainId={blockchainId} />
        </div>
      </div>
      <div className="transfer-card">
        <TransferTransaction
          baseApiUrl={baseApiUrl}
          blockchainId={blockchainId}
          privateKey={privateKey}
          keyType={keyType}
        />
      </div>
      <div className="transfer-card">
        <CreateAsset
          baseApiUrl={baseApiUrl}
          blockchainId={blockchainId}
          privateKey={privateKey}
          keyType={keyType}
        />
      </div>
      <div className="transfer-card">
        <MintAsset
          baseApiUrl={baseApiUrl}
          blockchainId={blockchainId}
          privateKey={privateKey}
          keyType={keyType}
        />
      </div>
    </div>
  );
}

export default App;
