const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const twilio = require("twilio");
require("dotenv").config();

const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const whatsappNumber = "whatsapp:" + process.env.TWILIO_WHATSAPP_NUMBER;

const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "water_usage_data.xlsx");

if (!fs.existsSync(dataFilePath)) {
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.aoa_to_sheet([["Date", "Value"]]);
  xlsx.utils.book_append_sheet(wb, ws, "Data");
  xlsx.writeFile(wb, dataFilePath);
}

app.post("/webhook", (req, res) => {
  const incomingMessage = req.body.Body;
  const from = req.body.From;
  const date = new Date().toLocaleDateString();

  if (incomingMessage.toLowerCase().includes("liters")) {
    const waterUsage = incomingMessage.match(/\\d+/)[0];

    const wb = xlsx.readFile(dataFilePath);
    const ws = wb.Sheets["Data"];
    const newRow = { Date: date, Value: `${waterUsage} liters` };
    const newRowData = [newRow.Date, newRow.Value];
    const wsData = xlsx.utils.sheet_to_json(ws, { header: 1 });
    wsData.push(newRowData);
    const newWs = xlsx.utils.aoa_to_sheet(wsData);
    wb.Sheets["Data"] = newWs;
    xlsx.writeFile(wb, dataFilePath);

    client.messages.create({
      body: `Data received: ${waterUsage} liters on ${date}`,
      from: whatsappNumber,
      to: from,
    });
  } else {
    client.messages.create({
      body: `Please input the water usage in the format 'XXX liters'.`,
      from: whatsappNumber,
      to: from,
    });
  }

  res.sendStatus(200);
});

setInterval(() => {
  client.messages.create({
    body: "Please send today's Water Usage Data.",
    from: whatsappNumber,
    to: "whatsapp:+918810498199", // Replace with the test number
  });
}, 300000); // 300000 ms = 5 minutes
