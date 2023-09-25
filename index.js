const { Printer } = require("@node-escpos/core");
const express = require("express");
const USB = require("@node-escpos/usb-adapter");
const app = express();

const device = new USB("28E9", "5812");
app.get("/print", async (req, res) => {
  try {
    await device.open(async function () {
      const printer = new Printer(device, options);
      printer.size(2, 2).align("rt").text("hello friends");
      printer.feed().feed().feed().align("lt");
      try {
        await printer.close();
      } catch (err) {
        // ? Do nothing
      }
    });
    res.send("Printing successful!");
  } catch {
    console.error("Error printing receipt:", error);
    res.status(500).send("Error printing receipt");
  }
});

app.listen(2999, () => {
  console.log("Server is running on http://localhost:2999");
});
