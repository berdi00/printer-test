const express = require("express");
const USB = require("@node-escpos/usb-adapter");
const app = express();

const device = new USB();
app.get("/print", async (req, res) => {
  try {
    await device.open();
    await device.print("Hello, World!");
    await device.cut();
    await device.close();
    res.send("Printing successful!");
  } catch {
    console.error("Error printing receipt:", error);
    res.status(500).send("Error printing receipt");
  }
});

app.listen(2999, () => {
  console.log("Server is running on http://localhost:2999");
});
