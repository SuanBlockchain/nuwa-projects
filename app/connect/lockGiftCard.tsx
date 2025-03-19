import { useEffect, useState } from "react";
import { theme } from "../app.config";
import { getLucidWasmBindings, Lucid } from "@/app/lib/lucid-client";
import { applyParams, AppliedValidators, readValidators } from "../lib/utils";
import CopyButton from "./copyButton";

interface LockGiftCardProps {
  instance: Awaited<ReturnType<typeof Lucid>>;
  usedAddresses: string[];
}

const LockGiftCard: React.FC<LockGiftCardProps> = ({ instance, usedAddresses }) => {
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
  }, [instance]);

  useEffect(() => {
    if (usedAddresses?.[0] && usedAddresses[0] !== walletAddress) {
      setWalletAddress(usedAddresses[0]);
    }
  }, [usedAddresses, walletAddress]);
  
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


      const contracts = await applyParams(tokenName, outputReferente, validator);
      setContracts(contracts);
    } else {
      console.error("Wallet address is null");
    }
  }

  async function createGiftCard(lovelaceAmount: string) {

    const lucid = await getLucidWasmBindings();

    setWatingLockTx(true);
    setLockTxHash(null);
    setError(null);

    try {
        const lovelace = BigInt(lovelaceAmount);
        const assetName = `${contracts.policyId}${lucid.fromText(tokenName)}`;
        
        const mintRedeemer = lucid.Data.to(new lucid.Constr(0, []));
        const utxos = await lucidInstance!.utxosAt(walletAddress);
        const utxo = utxos[0];
        const tx = await lucidInstance!.newTx()
            .collectFrom([utxo])
            .mintAssets({ [assetName]: 1n, }, mintRedeemer)
            .attach.MintingPolicy(contracts!.giftCard)
            .pay.ToContract(contracts.lockAddress, { kind: 'inline', value: lucid.Data.void()}, { lovelace: lovelace})
            .complete();


        const signedTx = await tx.sign.withWallet().complete();
        console.log("Signed transaction:", signedTx);
        console.log("Transaction:", tx);
        const txHash = await signedTx.submit();
        console.log("Transaction hash:", txHash);

        const success = await lucidInstance!.awaitTx(txHash);
        // const txHash = "184e10ec1a83a6362c41ceac9aa91c5d8cbf994fd5fdfb63c9cb0c40573f5110";
        // const success = true;

        setTimeout(() => {
            setWatingLockTx(false);

            if (success) {
              console.log("Transaction submitted successfully!", txHash);
              localStorage.setItem('cache', JSON.stringify({ tokenName, lovelaceAmount, contracts: contracts, lockTxHash: txHash }));
              // localStorage.setItem('cache', JSON.stringify(cache));
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

  async function redeemGiftCard() {

      const lucid = await getLucidWasmBindings();

      setWatingLockTx(true);
      setLockTxHash(null);
      setError(null);

      try {
          const cache = localStorage.getItem("cache");
          
          if (!cache) {
              throw new Error("Nothing found in local storage");
          }
          
          const { contracts, tokenName } = JSON.parse(cache);
          if (!contracts || !tokenName) {
              throw new Error("Invalid cache data");
          }


          const assetName = `${contracts.policyId}${lucid.fromText(tokenName)}`

          const burnRedeemer = lucid.Data.to(new lucid.Constr(1, []));
          const utxos = await lucidInstance!.utxosAt(contracts.lockAddress);
          const utxo = utxos[0];
          const tx = await lucidInstance!.newTx()
              .collectFrom([utxo], lucid.Data.void())
              .attach.MintingPolicy(contracts.giftCard)
              .attach.SpendingValidator(contracts.redeem)
              .mintAssets({ [assetName]: -1n }, burnRedeemer)
              .complete()

          const signedTx = await tx.sign.withWallet().complete();
          console.log("Signed transaction:", signedTx);
          console.log("Transaction:", tx);
          const txHash = await signedTx.submit();
          console.log("Transaction hash:", txHash);

          const success = await lucidInstance!.awaitTx(txHash);

          setTimeout(() => {
              setWatingLockTx(false);
  
              if (success) {
                  console.log("Transaction submitted successfully!", txHash);
                  localStorage.removeItem("cache")
                  setLockTxHash(txHash);
              }
          }, 3000);

      } catch (err) {
          console.error("Error redeeming gift card:", error);
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
          Make a one shot minting and lock funds in the contract
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
        This contract allows you to mint a token as giftCard to lock ADA in the smart contract. The locked ADA can only be redeemed by the wallet in possession of the giftCard and after burning it.
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
            <button
                type="submit"
                onClick={() => redeemGiftCard()}
                // disabled={!lovelaceAmount.trim()}
                style={{
                    background: !lovelaceAmount.trim() ? theme.colors.disabled : theme.colors.primary,
                    color: theme.colors.text.secondary,
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "none",
                    cursor: !lovelaceAmount.trim() ? "not-allowed" : "pointer",
                }}
            >
                {watingLockTx ? "Waiting for transaction..." : "Claim Token"}
            </button>
        </div>
        {lockTxHash && (
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <p style={{ color: "#22c55e" }}>Transaction submitted!</p>
                <a
                    href={`https://preview.cardanoscan.io/transaction/${lockTxHash}`}
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

export default LockGiftCard;