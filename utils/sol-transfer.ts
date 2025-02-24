import {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  TOKEN_2022_PROGRAM_ID
} from "@solana/spl-token";

import {
  Connection,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
  ParsedAccountData,
  ComputeBudgetProgram
} from "@solana/web3.js";

import * as bs58 from 'bs58';

import {
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const MINT_ADDR = process.env.NEXT_PUBLIC_MINT_ADDRESS || '';

async function getNumberDecimals(
  mintAddress: PublicKey,
  connection: Connection
): Promise<number> {
  try {
    const info = await connection.getParsedAccountInfo(mintAddress);
    if (!info.value) {
      throw new Error(`Failed to get token decimals for mint address: ${mintAddress.toString()}`);
    }
    const decimals = (info.value.data as ParsedAccountData).parsed.info
      .decimals as number;
    console.log(`Token Decimals: ${decimals}`);
    return decimals;
  } catch (error) {
    console.error(`Error getting token decimals: ${error}`);
    throw error;
  }
}

function initializeKeypair(): Keypair {
  try {
    const privateKey = new Uint8Array(bs58.decode(process.env.PRIVATE_KEY!));
    const keypair = Keypair.fromSecretKey(privateKey);
    console.log(
      `Initialized Keypair: Public Key - ${keypair.publicKey.toString()}`
    );
    return keypair;
  } catch (error) {
    console.error(`Error initializing keypair: ${error}`);
    throw error;
  }
}

function initializeConnection(): Connection {
  try {
    const rpcUrl = process.env.SOLANA_RPC!;
    const connection = new Connection(rpcUrl, {
      commitment: "confirmed",
      wsEndpoint: process.env.SOLANA_WSS,
    });
    console.log(`Initialized Connection to Solana RPC: ${rpcUrl.slice(0, -32)}`);
    return connection;
  } catch (error) {
    console.error(`Error initializing connection: ${error}`);
    throw error;
  }
}


async function getOrCreateAssociatedAccountWithRetry(
  connection: Connection,
  payer: Keypair,
  mintAddress: PublicKey,
  owner: PublicKey,
  maxRetries: number = 5,
  delay: number = 2000 
): Promise<PublicKey> {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const account = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mintAddress,
        owner,
        false,
        "confirmed",
        undefined,
        TOKEN_2022_PROGRAM_ID
      );
      return account.address;
    } catch (error: any) {
      console.error(`Attempt ${retries + 1} failed: ${error.message}`);
      retries++;
      if (retries < maxRetries) {
        await new Promise((res) => setTimeout(res, delay));
      } else {
        throw new Error(
          `Failed to create or get associated account after ${maxRetries} attempts`
        );
      }
    }
  }
  throw new Error("Exhausted all retries for creating associated token account");
}


export async function main(address: string, amount: number) {
  console.log("Starting Token Transfer Process");


  const connection = initializeConnection();


  try {
    const version = await connection.getVersion();
    console.log(`Connected to Solana cluster: ${version["solana-core"]}`);
  } catch (error:any) {
    console.error(`Failed to validate connection: ${error.message}`);
    return;
  }


  const fromKeypair = initializeKeypair();


  try {
    const balance = await connection.getBalance(fromKeypair.publicKey);
    console.log(`Wallet Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
  } catch (error:any) {
    console.error(`Failed to get wallet balance: ${error.message}`);
    return;
  }

  
  const destinationWallet = new PublicKey(address);


  if (!PublicKey.isOnCurve(destinationWallet.toBuffer())) {
    console.error(`Invalid destination wallet address: ${address}`);
    return;
  }

  console.log('Mint Address:', MINT_ADDR);
  const mintAddress = new PublicKey(MINT_ADDR);


  const PRIORITY_RATE = 12345;
  const transferAmount = Number(amount);

  const PRIORITY_FEE_INSTRUCTIONS = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: PRIORITY_RATE });
  console.log("----------------------------------------");


  let decimals;
  try {
    decimals = await getNumberDecimals(mintAddress, connection);
  } catch (error) {
    console.error(`Error getting decimals: ${error}`);
    return;
  }

 console.log(`From Keypair: ${fromKeypair.publicKey}`)
  let sourceAccount;

  try {
    sourceAccount = await getOrCreateAssociatedAccountWithRetry(
      connection,
      fromKeypair,
      mintAddress,
      fromKeypair.publicKey
    );
    console.log(`Source Account: ${sourceAccount.toString()}`);
  } catch (error: any) {
    console.error(`Failed to get or create source account: ${error.message}`);
    return;
  }


  let destinationAccount;
  try {
    destinationAccount = await getOrCreateAssociatedAccountWithRetry(
      // connection,
      // fromKeypair,
      // mintAddress,
      // destinationWallet,
      // false,
      // 'confirmed',
      // undefined,
      // TOKEN_2022_PROGRAM_ID
      connection,
      fromKeypair,
      mintAddress,
      destinationWallet
    );
    // console.log(`Destination Account: ${destinationAccount.address.toString()}`);
    console.log(`Destination Account: ${destinationAccount.toString()}`);
  } catch (error:any) {
    console.error(`Failed to get or create destination account: ${error.message}`);
    return;
  }

  console.log("----------------------------------------");


  const transferAmountInDecimals = transferAmount * Math.pow(10, decimals);

 
  const transferInstruction = createTransferInstruction(
    sourceAccount,
    destinationAccount,
    fromKeypair.publicKey,
    transferAmountInDecimals,
    [],
    TOKEN_2022_PROGRAM_ID
  );
  console.log(`Transaction instructions: ${JSON.stringify(transferInstruction)}`);

 
  let latestBlockhash;
  try {
    latestBlockhash = await connection.getLatestBlockhash("confirmed");
  } catch (error:any) {
    console.error(`Failed to get latest blockhash: ${error.message}`);
    return;
  }


  const messageV0 = new TransactionMessage({
    payerKey: fromKeypair.publicKey,
    recentBlockhash: latestBlockhash.blockhash,
    instructions: [PRIORITY_FEE_INSTRUCTIONS, transferInstruction],
  }).compileToV0Message();
  const versionedTransaction = new VersionedTransaction(messageV0);
  versionedTransaction.sign([fromKeypair]);
  console.log("Transaction Signed. Preparing to send...");

 
  try {
    const txid = await connection.sendTransaction(versionedTransaction, {
      maxRetries: 20,
    });
    console.log(`Transaction Submitted: ${txid}`);


    const confirmation = await connection.confirmTransaction(
      {
        signature: txid,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      },
      "confirmed"
    );
    if (confirmation.value.err) {
      throw new Error("🚨Transaction not confirmed.");
    }
    console.log(`Transaction Successfully Confirmed! 🎉 View on SolScan: https://explorer.solana.com/tx/${txid}`);
    return {
      status: "ok",
      txId: txid
    }
  } catch (error) {
    console.error("Transaction failed", error);
    return;
  }
}


if (require.main === module) {
  (async () => {
    const address = process.argv[2]; 
    const amount = parseFloat(process.argv[3]); 
    if (!address || !amount) {
      console.error("Usage: ts-node sol-transfer.ts <destination_address> <amount>");
      process.exit(1);
    }
    try {
      await main(address, amount);
    } catch (error) {
      console.error("Error executing main function:", error);
    }
  })();
}
