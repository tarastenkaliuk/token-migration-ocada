export type Network = "sepolia" | "mainnet";
export type Address = string;
export type AddressBook = {
  [network in Network]: {
    birdToken: Address;
    tokenMigration: Address;
  }
}