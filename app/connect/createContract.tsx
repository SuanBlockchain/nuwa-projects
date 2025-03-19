import { useEffect, useState } from "react";
import { theme } from "../app.config";
import { Constr, Data, fromText, Lucid, LucidEvolution } from "@lucid-evolution/lucid";
import { applyParams, AppliedValidators, readValidators } from "../lib/utils";
import { Copy } from "lucide-react";
import CopyButton from "./copyButton";

interface CreateContractProps {
  instance: Awaited<ReturnType<typeof Lucid>>;
  usedAddresses: string[];
}

const CreateContract: React.FC<CreateContractProps> = ({ instance, usedAddresses }) => {
  const [validator, setValidator] = useState<string>("");
  const [tokenName, setTokenName] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [lucidInstance, setLucidInstance] = useState<Awaited<
    ReturnType<typeof Lucid>
  > | null>(null);
  const [contracts, setContracts] = useState<AppliedValidators>(() => ({} as AppliedValidators));
  const [lovelaceAmount, setLovelaceAmount] = useState<string>("");
  const [watingLockTx, setWatingLockTx] = useState<boolean>(false);
  const [lockTxHash, setLockTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadValidators();
    if (instance) {
      setLucidInstance(instance);
    }
  }, []);

  if (usedAddresses?.[0] && usedAddresses[0] !== walletAddress) {
    setWalletAddress(usedAddresses[0]);
  }

  const loadValidators = async () => {
    const validator = readValidators();
    setValidator(validator.giftCard);
  };

  async function submitTokenName(tokenName: string) {
    if (walletAddress) {
      const utxos = await lucidInstance?.utxosAt(walletAddress);
      const utxo = utxos?.[0];
      if (!utxo) {
        console.error("No UTXOs found");
        return;
      }
      const outputReferente = {
        txHash: utxo.txHash,
        outputIndex: utxo.outputIndex,
      }

      const contracts = applyParams(tokenName, outputReferente, validator);
      setContracts(contracts);
    } else {
      console.error("Wallet address is null");
    }
  }

  async function createGiftCard(lovelaceAmount: string) {
    console.log("Gift Ada:", lovelaceAmount);

    setWatingLockTx(true);

    try {
        const lovelace = BigInt(lovelaceAmount);
        const assetName = `${contracts.policyId}${fromText(tokenName)}`;
        
        const mintRedeemer = Data.to(new Constr(0, []));
        const utxos = await lucidInstance?.utxosAt(walletAddress)!;
        const utxo = utxos[0];
        console.log(contracts.giftCard, utxo);
        const tx = await lucidInstance!.newTx()
            .collectFrom([utxo])
            .mintAssets({ [assetName]: 1n, }, mintRedeemer)
            .attach.MintingPolicy(contracts!.giftCard)
            .pay.ToContract(contracts.lockAddress, { kind: 'inline', value: Data.void()}, { lovelace: lovelace})
            .complete();


        const signedTx = await tx.sign.withWallet().complete();
        const txHash = await signedTx.submit();

        const success = await lucidInstance!.awaitTx(txHash);

        // const txHash = "1234567890";
        // const success = true;

        setTimeout(() => {
            setWatingLockTx(false);

            if (success) {
                console.log("Transaction submitted successfully!", txHash);
                localStorage.setItem('cache', JSON.stringify({ tokenName, lovelaceAmount, contracts: contracts, lockTxHash: txHash }));
                setLockTxHash(txHash);
            }
        }, 3000);

        
        } catch (err) {
            console.error("Error creating gift card:", err);
            setError(err instanceof Error ? err.message : "Transaction failed");
        } finally {
            setWatingLockTx(false);
        }

    }


     

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            color: theme.colors.text.secondary,
            fontSize: "0.875rem",
          }}
        >
          Make a one shot minting and lock contract
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              color: theme.colors.text.primary,
              fontSize: "0.875rem",
              fontFamily: "inherit",
              background: theme.colors.background.secondary,
              padding: "0.5rem 0.75rem",
              borderRadius: "6px",
              border: `1px solid ${theme.colors.border.secondary}`,
            }}
          >
            {validator.slice(0, 20)}...{validator.slice(-20)}
          </span>
            {validator && (
                <CopyButton text={validator} /> // Pass validator as a string
            )}
        </div>
      </div>
      <p
        style={{
          marginTop: "0.5rem",
          color: theme.colors.text.secondary,
          fontSize: "0.875rem",
        }}
      >
        This contract allows you to mint a token as giftCard to lock ADA in the smart contract. The locked ADA can only be redeemed by burning the giftCard.
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              color: theme.colors.text.secondary,
              fontSize: "0.875rem",
            }}
          >
            Token Name
          </span>
          <input
            type="text"
            name="tokenName"
            id="tokenName"
            required
            className="p-2 border rounded w-48"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)} 
          />
        </div>
        <button
          type="submit"
          onClick={() => submitTokenName(tokenName)} // Pass the tokenName state to the function
          disabled={!tokenName.trim()} // Disable button if tokenName is empty
          style={{
            background: !tokenName.trim() ? theme.colors.disabled : theme.colors.primary, // Change background color when disabled
            color: theme.colors.text.secondary,
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "none",
            cursor: !tokenName.trim() ? "not-allowed" : "pointer", // Change cursor when disabled
          }}
        >
          Make Contract
        </button>
      </div>

      {contracts && contracts.redeem && contracts.redeem.script && (
        <div>
            <div
                style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                }}
                >
                <span
                style={{
                    color: theme.colors.text.secondary,
                    fontSize: "0.875rem",
                }}
                >
                Compiled contract
                </span>
                <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                }}
                >
                    <span
                        style={{
                        color: theme.colors.text.primary,
                        fontSize: "0.875rem",
                        fontFamily: "inherit",
                        background: theme.colors.background.secondary,
                        padding: "0.5rem 0.75rem",
                        borderRadius: "6px",
                        border: `1px solid ${theme.colors.border.secondary}`,
                        }}
                    >
                        {contracts.redeem.script.slice(0, 20)}...{contracts.redeem.script.slice(-20)}
                    </span>
                    {contracts.redeem.script && (
                        <CopyButton text={contracts.redeem.script} /> // Pass script as a string
                    )}
                </div>
            </div>

            <div
                style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                }}
                >
                <span
                style={{
                    color: theme.colors.text.secondary,
                    fontSize: "0.875rem",
                }}
                >
                Contract Lock Address
                </span>
                <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                }}
                >
                    <span
                        style={{
                        color: theme.colors.text.primary,
                        fontSize: "0.875rem",
                        fontFamily: "inherit",
                        background: theme.colors.background.secondary,
                        padding: "0.5rem 0.75rem",
                        borderRadius: "6px",
                        border: `1px solid ${theme.colors.border.secondary}`,
                        }}
                    >
                        {contracts.lockAddress}
                    </span>
                </div>
            </div>

        </div>
      )}

        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "1rem",
            }}
        >
            <div
                style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                }}
            >
                <span
                    style={{
                        color: theme.colors.text.secondary,
                        fontSize: "0.875rem",
                    }}
                >
                Lock Ada amount
                </span>
                <input
                    type="number"
                    name="lovelaceAmount"
                    id="lovelaceAmount"
                    required
                    className="p-2 border rounded w-24"
                    value={lovelaceAmount} 
                    onChange={(e) => setLovelaceAmount(e.target.value)}
                />
            </div>
            <button
                type="submit"
                onClick={() => createGiftCard(lovelaceAmount)}
                disabled={!lovelaceAmount.trim()}
                style={{
                    background: !lovelaceAmount.trim() ? theme.colors.disabled : theme.colors.primary,
                    color: theme.colors.text.secondary,
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "none",
                    cursor: !lovelaceAmount.trim() ? "not-allowed" : "pointer",
                }}
            >
                {watingLockTx ? "Waiting for transaction..." : "Create transaction"}
            </button>
        </div>
        {lockTxHash && (
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <p style={{ color: "#22c55e" }}>Transaction submitted!</p>
                <a
                    href={`https://preprod.cardanoscan.io/transaction/${lockTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: theme.colors.primary }}
                >
                    View on Explorer
                </a>
            </div>
        )}

        {error && (
            <p style={{ color: "#ef4444", marginTop: "1rem" }}>Error: {error}</p>
        )}
    </div>
  );
};

export default CreateContract;