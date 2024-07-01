import React, { useState } from "react";
import { mintAsset, initializeSDK } from "../services/nuklaiService";

interface MintAssetProps {
  baseApiUrl: string;
  blockchainId: string;
  privateKey: string;
  keyType: string;
}

const MintAsset: React.FC<MintAssetProps> = ({
  baseApiUrl,
  blockchainId,
  privateKey,
  keyType
}) => {
  const [receiverAddress, setReceiverAddress] = useState<string>(
    "nuklai1qpxncu2a69l9wyz3yqg4fqn86ys2ll6ja7vhym5qn2vk4cdyvgj2vn4k7wz"
  );
  const [assetID, setAssetID] = useState<string>("");
  const [amount, setAmount] = useState<string>("10");
  const [txID, setTxID] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sdk = initializeSDK(baseApiUrl, blockchainId);
      const id = await mintAsset(
        sdk,
        privateKey,
        keyType,
        receiverAddress,
        assetID,
        parseFloat(amount)
      );
      setTxID(id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="asset-card">
      <h2>Mint Asset</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Asset ID</label>
          <input
            type="text"
            value={assetID}
            onChange={(e) => setAssetID(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button type="submit">Mint</button>
      </form>
      {txID && (
        <div>
          <h3>Transaction ID</h3>
          <p>{txID}</p>
        </div>
      )}
    </div>
  );
};

export default MintAsset;
