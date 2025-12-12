const ENV = process.env.NEXT_PUBLIC_ENV || "dev";

let address: `0x${string}` = "0x18998c7E38ede4dF09cEec08E5372Bf8fe5719ea"; // hardhat;
switch (ENV) {
  case "staging": // sepolia
    address = "0xc27Ef590f18d58F9BF8CE28adBE891dA68facdDF";
    break;
}
export const contractAddress = address;