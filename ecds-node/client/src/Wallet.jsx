import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1"
import { toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKeyTmp = evt.target.value;
    setPrivateKey(privateKeyTmp);
    const addressTmp = secp.getPublicKey(privateKey)
    setAddress(toHex(keccak256(addressTmp.slice(1)).slice(-20)))
    if (address) { 
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Enter Private Key" value={privateKey} onChange={onChange}></input>
      </label>

      <div>
        Address: {address.slice(0,10)}...
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
