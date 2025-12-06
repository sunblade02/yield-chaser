const ENV = process.env.NEXT_PUBLIC_ENV || "dev";

let address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // hardhat;
switch (ENV) {
  case "staging": // sepolia
    address = "0x361680F6052786187dFEe22355eD18113A8de3DC";
    break;
}
export const contractAddress = address