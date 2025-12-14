const ENV = process.env.NEXT_PUBLIC_ENV || "dev";

let address: `0x${string}` = "0x18998c7E38ede4dF09cEec08E5372Bf8fe5719ea"; // hardhat;
switch (ENV) {
  case "staging": // sepolia
    address = "0x696f091108b91741df786075e70FA8A2b89eaE1d";
    break;
}
export const contractAddress = address;