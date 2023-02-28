import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";

import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [range, setRange] = useState([]);
  const [transactions, setTransaction] = useState([]);
  const [isNull, setIsNull] = useState(true);

  useEffect(() => {
    async function getBlockRange() {
      setBlockNumber(await alchemy.core.getBlockNumber());
      const arrayRange = (start, stop, step) =>
        Array.from(
          { length: (stop - start) / step + 1 },
          (value, index) => start + index * step
        );

        setRange(arrayRange(blockNumber, blockNumber+20,1))
        console.log(range)
        setIsNull(false);
    }
    if(isNull){
      getBlockRange();
    }
    
  });

  const getTransactions = async (value) => {
    const blockTransaction = await alchemy.core.getBlockWithTransactions(value);
    setTransaction(blockTransaction);
    console.log(blockTransaction)
  }

  return <div className="p-5">
    {transactions.length ===0 ? (<div>{range.map((value) => {
      return <div className="p-10 mb-5 hover:bg-gray-200 hover:font-bold border-2"onClick={() => getTransactions(value)}>Block #{value}</div>
    })}</div>)
    :<div className="grid grid-cols-2">
      <div>
      {range.map((value) => {
      return <div className="p-10 mb-5 hover:bg-gray-200 hover:font-bold border-2"onClick={() => getTransactions(value)}>Block #{value}</div>
    })}
      </div>
      <div className="border-2 p-10 mx-5">
        <h1>{transactions.hash}</h1>
      </div>
    </div>}
  </div>;
}

export default App;
