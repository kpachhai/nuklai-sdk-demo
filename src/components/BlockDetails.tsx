import { chain, HyperchainSDK, services } from "@nuklai/hyperchain-sdk";
import React, { useEffect, useState } from "react";

interface BlockDetailsProps {
  baseApiUrl: string;
  blockchainId: string;
}

const BlockDetails: React.FC<BlockDetailsProps> = ({
  baseApiUrl,
  blockchainId
}) => {
  const [blocks, setBlocks] = useState<chain.StatefulBlock[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sdk, setSdk] = useState<HyperchainSDK | null>(null);
  const [webSocketService, setWebSocketService] =
    useState<services.WebSocketService | null>(null);

  useEffect(() => {
    const initializedSdk = new HyperchainSDK({
      baseApiUrl,
      blockchainId
    });
    setSdk(initializedSdk);
    setWebSocketService(initializedSdk.wsService);
  }, [baseApiUrl, blockchainId]);

  useEffect(() => {
    if (webSocketService) {
      const connectAndListen = async () => {
        try {
          await webSocketService.connect();
          const err = await webSocketService.registerBlocks();
          if (err) {
            setError("Failed to register blocks");
            return;
          }

          const listenBlocks = async () => {
            try {
              const { block, results, prices, err } =
                await webSocketService.listenBlock(
                  sdk.actionRegistry,
                  sdk.authRegistry
                );
              if (err) {
                setError("Failed to listen for blocks");
                return;
              }

              setBlocks((prevBlocks) => {
                const updatedBlocks = [block, ...prevBlocks];
                return updatedBlocks.slice(0, 2); // Keep only the latest 2 blocks
              });
            } catch (err) {
              setError("Failed to listen for blocks");
              console.error(err);
            }
          };

          // Initial block fetch
          listenBlocks();

          // Fetch blocks periodically
          const interval = setInterval(listenBlocks, 3000);

          return () => clearInterval(interval);
        } catch (err) {
          setError("Failed to listen for blocks");
          console.error(err);
        }
      };

      connectAndListen();
    }

    return () => {
      if (webSocketService) {
        webSocketService.close();
      }
    };
  }, [webSocketService, sdk]);

  return (
    <div>
      <h2>Block Details</h2>
      {error && <div>Error: {error}</div>}
      <div>
        {blocks.map((block, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px 0"
            }}
          >
            <p>
              <strong>Height:</strong> {block.hght.toString()}
            </p>
            <p>
              <strong>Timestamp:</strong>{" "}
              {new Date(Number(block.tmstmp)).toLocaleString()}
            </p>
            <p>
              <strong>Parent ID:</strong> {block.prnt.toString()}
            </p>
            <p>
              <strong>State Root:</strong> {block.stateRoot.toString()}
            </p>
            <p>
              <strong>Size:</strong> {block.size}
            </p>
            <p>
              <strong>Transaction Count:</strong> {block.txs.length}
            </p>
            <p>
              <strong>Auth Counts:</strong>{" "}
              {JSON.stringify(Array.from(block.authCounts.entries()))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockDetails;
