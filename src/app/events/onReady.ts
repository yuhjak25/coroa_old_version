import { ActivityType, Events } from "discord.js";
import { connection } from "../../config/database/connect-mongo";
import CoroaClient from "../../app";

export default {
  name: Events.ClientReady,
  run: async (client: CoroaClient) => {
    const reset = "\x1b[0m";
    const bold = "\x1b[1m";
    const color = (r, g, b) => `\x1b[38;2;${r};${g};${b}m`;

    const styledUsername = `${bold}${color(194, 255, 11)}${
      client.user?.username
    }${reset}`;

    console.log(`🤖 Iniciada la sesión como: ${styledUsername}`);
    connection.then(() => console.log("🍃 MongoDB Conectado"));
    client.user?.setActivity("Coroa Network", {
      type: ActivityType.Competing,
    });
  },
};
