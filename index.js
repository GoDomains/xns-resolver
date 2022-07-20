const Web3 = require("web3");
const namehash = require("eth-ens-namehash");
const multihash = require("multihashes");
const contentHash = require("@ensdomains/content-hash");

const REGISTRAR_MAIN_NET = "0x314159265dd8dbb310642f98f50c066173c1259b";
const REGISTRAR_ROPSTEN = "0x112234455c3a32fd11230c42e7bccd4a84e02010";
const REGISTRAR_APOTHEM = "0x596F02DF7513aaEb8B707971FbA8c35A2F6381E8";

var abi = {
  registrar: require("./contracts/registrar.json"),
  resolver: require("./contracts/resolver.json"),
};

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
    case 50:
      return "https://rpc-mainnet.xinfin.yodaplus.net";
    case 51:
      return "https://rpc-apothem.xinfin.yodaplus.net";
    default:
      return "https://rpc-mainnet.xinfin.yodaplus.net";
  }
}
function getRegistrarAddress(network) {
  switch (network) {
    case 50:
      return REGISTRAR_MAIN_NET;
    case 51:
      return REGISTRAR_APOTHEM;
    default:
      return REGISTRAR_APOTHEM;
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
          reject(null);
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
