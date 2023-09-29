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

var ssp = require("ssp");
var notes = {
  1: "1TMT",
  2: "5TMT",
  3: "10TMT",
  4: "20TMT",
  5: "50TMT",
  6: "100TMT",
};

ssp.init(function () {
  ssp.on("ready", function () {
    console.log("Device is ready");
    ssp.enable();
  });
  ssp.on("read_note", function (note) {
    if (note > 0) {
      console.log("GOT", notes[note]);
      if (note === 3) {
        // suddenly we decided that we don't need 1000 KZT
        ssp.commands.exec("reject_banknote");
      }
    }
  });
  ssp.on("disable", function () {
    console.log("disabled");
  });
  ssp.on("note_cleared_from_front", function (note) {
    console.log("note_cleared_from_front");
  });
  ssp.on("note_cleared_to_cashbox", function (note) {
    console.log("note_cleared_to_cashbox");
  });
  ssp.on("credit_note", function (note) {
    console.log("CREDIT", notes[note]);
  });
  ssp.on("safe_note_jam", function (note) {
    console.log("Jammed", note);
    //TODO: some notifiaction, recording, etc.
  });
  ssp.on("unsafe_note_jam", function (note) {
    ``;
    console.log("Jammed inside", note);
    //TODO: some notifiaction, recording, etc.
  });
  ssp.on("fraud_attempt", function (note) {
    console.log("Fraud!", note);
    //TODO: some notifiaction, recording, etc.
  });
  ssp.on("stacker_full", function (note) {
    console.log("I'm full, do something!");
    ssp.disable();
    //TODO: some notifiaction, recording, etc.
  });
  ssp.on("note_rejected", function (reason) {
    console.log("Rejected!", reason);
  });
  ssp.on("error", function (err) {
    console.log(err.code, err.message);
  });
});

app.listen(2999, () => {
  console.log("Server is running on http://localhost:2999");
});
