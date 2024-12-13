import { ApplicationCommandOptionType, PermissionResolvable } from "discord.js";
import Category from "../../../config/interfaces/Category";
import { SlashCommandData } from "../../../config/types/types";
import { hasPermissions } from "../../../config/functions/functions";

const requiredPermissions: PermissionResolvable[] = [
  "SendMessages",
  "UseApplicationCommands",
];

const sayCommand: SlashCommandData = {
  name: "say",
  description: "Sends a message with the content that you want.",
  category: Category.gen,
  memberPermissions: requiredPermissions,
  options: [
    {
      name: "message",
      description: "The message you want to send.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, int, args) => {
    const userHasPermissions = await hasPermissions(int, requiredPermissions);

    if (!userHasPermissions) {
      return;
    }
    try {
      //@ts-ignore
      const message = int.options.getString("message");

      int.deferReply;
      int.reply(message);
    } catch (err) {
      console.log(err);
    }
  },
};
export default sayCommand;
