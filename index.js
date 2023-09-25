const { Printer } = require("@node-escpos/core");
const express = require("express");
const USB = require("@node-escpos/usb-adapter");
const app = express();

app.get("/print", async (req, res) => {
  let device;

  try {
    // give VID and PID
    device = new USB();
  } catch (error) {
    Promise.reject(err);
    throw new Error("Couldn't define printer");
  }

  device.open(async function (err) {
    if (err) {
      Promise.reject(err);
      throw new Error("Couldn't open printer");
    }
    const options = { encoding: "ISO-8859-9" };
    const printer = new Printer(device, options);
    printer.size(2, 2).align("rt").text("hello");
    printer.feed().feed().feed().align("lt");
    printer.buffer.write(Buffer.from([0x1b, 0x69]));
    try {
      await printer.close();
    } catch (err) {}
  });
  return res.send("Printed successfully");
});

app.listen(2999, () => {
  console.log("Server is running on http://localhost:2999");
});
