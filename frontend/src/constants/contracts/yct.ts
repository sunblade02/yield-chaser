const ENV = process.env.NEXT_PUBLIC_ENV || "dev";

let address: `0x${string}` = "0x18998c7E38ede4dF09cEec08E5372Bf8fe5719ea"; // hardhat;
switch (ENV) {
  case "staging": // sepolia
    address = "0x3238E261FeC14Fc92B2d405D2338980E8B6b7Cb2";
    break;
}
export const contractAddress = address;