const telegram = require("node-telegram-bot-api");
const bitcoin = require("./bitcoin.min.js");

const options = {
  webHook: {
    port: process.env.PORT
  }
};

const url = "https://ltcp2shbot.herokuapp.com/";

const bot = new telegram(require("./config").token, options);
bot.setWebHook(`${url}/bot${require("./config").token}`);

bot.on("message", msg => {
  const text = msg.text;
  const chatid = msg.chat.id;
  if (text !== "/start" && text !== "/help") {
    let message;
    let address;

    try {
      address = text;
      decoded = bitcoin.address.fromBase58Check(address);
      version = decoded["version"];
      switch (version) {
        case 5:
          message = "Mainnet p2sh address: ";
          version = 50;
          break;
        case 50:
          message = "Mainnet p2sh address (deprecated): ";
          version = 5;
          break;
        case 196:
          message = "Testnet p2sh address: ";
          version = 58;
          break;
        case 58:
          message = "Testnet p2sh address (deprecated): ";
          version = 196;
          break;
        default:
          throw "unknown";
      }

      address = bitcoin.address.toBase58Check(decoded["hash"], version);
    } catch (err) {
      message = "Please enter a valid address.";
      address = "";
    }
    bot.sendMessage(chatid, message + <code>${address}</code>, {
      parse_mode: "HTML"
    });
  } else {
    bot.sendMessage(
      chatid,
      "send litecoin address to convert between old and new Litecoin P2SH address formats"
    );
  }
});
