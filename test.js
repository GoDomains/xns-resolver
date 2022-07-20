const { resolveEthAddress, resolveIpfs } = require("./index");

async function main() {
  try {
    const ipfsContent = await resolveIpfs("rushi.xdc");
    console.log(
      "🚀 ~ file: test.js ~ line 6 ~ main ~ ipfsContent",
      ipfsContent
    );
    const ethAddress = await resolveEthAddress("nitish.xdc");
    console.log("🚀 ~ file: test.js ~ line 8 ~ main ~ ethAddress", ethAddress);
  } catch (e) {
    console.log(e);
  }
}
main();
