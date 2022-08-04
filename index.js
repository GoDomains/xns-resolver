const Web3 = require("web3");
const namehash = require("eth-ens-namehash");
const multihash = require("multihashes");
const contentHash = require("@ensdomains/content-hash");

const REGISTRAR_MAIN_NET = "0x3C69E80658eeDd01B0c023f5e65dDf8516B02BeF";
const REGISTRAR_APOTHEM = "0xc5e1cBf8c3900F283a04E640cDA100aAa59666Ac";

var abi = {
  registrar: require("./contracts/registrar.json"),
  resolver: require("./contracts/resolver.json"),
};
const NotFoundError = new Error("ENS name not defined.");

function resolveIpfs(name, network) {
  const rpc = getNetworkRpc(network);
  const contractaddress = getRegistrarAddress(network);
  var web3 = new Web3(new Web3.providers.HttpProvider(rpc));
  let hash = namehash.hash(name);
  console.log("🚀 ~ file: index.js ~ line 21 ~ resolveIpfs ~ hash", hash);
  Registrar = new web3.eth.Contract(abi.registrar, contractaddress);
  return new Promise((resolve, reject) => {
    Registrar.methods
      .resolver(hash)
      .call()
      .then((address) => {
        console.log("🚀 ~ file: index.js ~ line 27 ~ .then ~ address", address);
        if (address === "0x0000000000000000000000000000000000000000") {
          reject(null);
        } else {
          Resolver = new web3.eth.Contract(abi.resolver, address);
          return Resolver.methods.contenthash(hash).call();
        }
      })
      .then((hash) => {
        if (hash) {
          // Remove 0x prefix

          hex = hash.substring(2);
          let decodedContentHash = contentHash.decode(hash);

          // Multihash encode and convert to base58
          resolve(decodedContentHash);
        } else {
          reject("fisk");
        }
      });
  });
}
function getNetworkRpc(network) {
  switch (network) {
    case "50":
      return "https://rpc.xinfin.yodaplus.net";
    case "51":
      return "https://rpc-apothem.xinfin.yodaplus.net";
    default:
      return "https://rpc.xinfin.yodaplus.net";
  }
}
function getRegistrarAddress(network) {
  switch (network) {
    case "50":
      return REGISTRAR_MAIN_NET;
    case "51":
      return REGISTRAR_APOTHEM;
    default:
      return REGISTRAR_MAIN_NET;
  }
}
function resolveEthAddress(name, network) {
  const rpc = getNetworkRpc(network);
  const contractaddress = getRegistrarAddress(network);
  var web3 = new Web3(new Web3.providers.HttpProvider(rpc));
  let hash = namehash.hash(name);
  console.log("🚀 ~ file: index.js ~ line 52 ~ resolveEthAddress ~ hash", hash);

  Registrar = new web3.eth.Contract(abi.registrar, contractaddress);
  return new Promise((resolve, reject) => {
    Registrar.methods
      .resolver(hash)
      .call()
      .then((address) => {
        console.log("🚀 ~ file: index.js ~ line 58 ~ .then ~ address", address);
        if (address === "0x0000000000000000000000000000000000000000") {
          resolve("0x0000000000000000000000000000000000000000");
        } else {
          Resolver = new web3.eth.Contract(abi.resolver, address);
          resolve(Resolver.methods.addr(hash).call());
        }
      });
  });
}

module.exports = {
  resolveIpfs,
  resolveEthAddress,
};
