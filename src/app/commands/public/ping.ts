import { PermissionResolvable, CommandInteraction } from "discord.js";
import Category from "../../../config/interfaces/Category";
import { SlashCommandData } from "../../../config/types/types";
import { hasPermissions } from "../../../config/functions/functions";

const requiredPermissions: PermissionResolvable[] = [
  "SendMessages",
  "UseApplicationCommands",
];

const pingCmd: SlashCommandData = {
  name: "ping",
  description: "Reply with pong and latency in ms.",
  category: Category.mod,
  memberPermissions: requiredPermissions,
  run: async (client, int: CommandInteraction, args) => {
    const userHasPermissions = await hasPermissions(int, requiredPermissions);

    if (!userHasPermissions) {
      return;
    }
    try {
      const sent = await int.reply({
        content: "<a:Loading:1255119025097146431>  Calculating ping...",
        fetchReply: true,
      });

      const latency = sent.createdTimestamp - int.createdTimestamp;

      await int.editReply(`Pong! Latency is \`${latency}\`ms.`);
    } catch (error) {
      console.error("Error replying to ping command:", error);
    }
  },
};

export default pingCmd;
