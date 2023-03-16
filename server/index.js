const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04dac34cdfeb32adb9689570aee9d7e7956359eee1decfa7b9c1b36048adf93854c84a059f3fab1ea97c4ce12471dc5138c9a68a8c6128ef11ed2cd3cd7a250542": 100,
  "040a655e41887f5e4396bb0dbe1d5f968dc10a336a0b18ac18f6936736d5160a2d02e938d120794784cf72958d615b57c03ddc54a5a03ef1fb2d9475524faf2054": 50,
  "04f64e276b6da3c50f81efaff5f964b15463c191c95904da8dd99f6fb7b3b95afcca251ccc9a6d06efc672124777ef07811b512e07fd882ad16dc39edec04cdb9f": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

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
