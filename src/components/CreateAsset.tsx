import React, { useState } from "react";
import { createAsset, initializeSDK } from "../services/nuklaiService";

interface CreateAssetProps {
  baseApiUrl: string;
  blockchainId: string;
  privateKey: string;
  keyType: string;
}

const CreateAsset: React.FC<CreateAssetProps> = ({
  baseApiUrl,
  blockchainId,
  privateKey,
  keyType
}) => {
  const [symbol, setSymbol] = useState<string>("KP");
  const [decimals, setDecimals] = useState<string>("1");
  const [metadata, setMetadata] = useState<string>("Test token");
  const [result, setResult] = useState<{
    txID: string;
    assetID: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sdk = initializeSDK(baseApiUrl, blockchainId);
      const res = await createAsset(
        sdk,
        privateKey,
        keyType,
        symbol,
        parseInt(decimals),
        metadata
      );
      setResult(res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="asset-card">
      <h2>Create Asset</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Symbol</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Decimals</label>
          <input
            type="number"
            value={decimals}
            onChange={(e) => setDecimals(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Metadata</label>
          <input
            type="text"
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
      {result && (
        <div>
          <h3>Transaction ID</h3>
          <p>{result.txID}</p>
          <h3>Asset ID</h3>
          <p>{result.assetID}</p>
        </div>
      )}
    </div>
  );
};

export default CreateAsset;
