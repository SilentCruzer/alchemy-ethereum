const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "013021f69fe13b8390e0648e19f15e8e8b14ce38": 100,
  "946db69e96ea4a2e5c4f9fc2c4933f4df7edfed4": 50,
  "d7ad8d6f9075a694efd30a49b615b4d8670efe15": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { sender, recipient, amount, signature, recovery } = await req.body;

  const bytes = utf8ToBytes(JSON.stringify({ sender, recipient, amount }));
  const hash = keccak256(bytes);

  const sig = new Uint8Array(signature);
  const publicKey = keccak256(await secp.recoverPublicKey(hash, sig, recovery).slice(1)).slice(-20);

  if(toHex(publicKey) !== sender){
    res.status(400).send({ message: "Not a valid signature" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
