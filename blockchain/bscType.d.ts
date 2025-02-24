export type BscNetwork = "bsct" | "bsc";
export type BscAddress = string;
export type BscAddressBook = {
  [network in BscNetwork]: {
    birdToken: BscAddress;
    tokenMigration: BscAddress;
  }
}