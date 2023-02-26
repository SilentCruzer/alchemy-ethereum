import { useState } from "react";
import server from "./server";
import{ keccak256 } from "ethereum-cryptography/keccak";
import  { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import {sign} from "ethereum-cryptography/secp256k1";
import * as secp from "ethereum-cryptography/secp256k1";


function Transfer({ address, setBalance, privateKey}) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);


  function hash(str){
    return keccak256(utf8ToBytes(str));
  }

  async function transfer(evt) {
    evt.preventDefault();

    const data = { sender: address, recipient, amount: parseInt(sendAmount)};
    const hash = hash(JSON.stringify(data));

    const signedObject = await secp.sign(hash, privateKey, { recovered: true });
    const sig = Array.from(signedObject[0])
    const recoveryBit = signedObject[1];


    try {
      const {
        data: { balance },
      } = await server.post(`/send`, {
        ...data,
        signature: sig,
        recovery: recoveryBit
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
