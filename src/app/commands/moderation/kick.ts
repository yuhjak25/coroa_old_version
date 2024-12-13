import {
  ApplicationCommandOptionType,
  PermissionResolvable,
  GuildMember,
} from "discord.js";
import Category from "../../../config/interfaces/Category";
import { SlashCommandData } from "../../../config/types/types";

const requiredPermissions: PermissionResolvable[] = [
  "KickMembers",
  "SendMessages",
  "UseApplicationCommands",
];

const kickCmd: SlashCommandData = {
  name: "kick",
  description: "Kick a user from the server",
  category: Category.mod,
  memberPermissions: requiredPermissions,
  options: [
    {
      name: "user",
      description: "The user to kick.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "reason",
      description: "The reason for kicking the user.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async (client, int, args) => {
    //@ts-ignore
    const userKick = int.options.getUser("user");
    //@ts-ignore
    const reason = int.options.getString("reason") || "No reason provided";
    const user = int.user;

    if (user.id === userKick.id) {
      await int.reply({
        content: "You cannot kick yourself.",
        ephemeral: true,
      });
      return;
    }

    const member = await int.guild?.members.fetch(userKick.id);
    if (!member) {
      await int.reply({
        content: "The user is not a member of this server.",
        ephemeral: true,
      });
      return;
    }

    try {
      await member.kick(`Kicked by ${user.username} - Reason: ${reason}`);
      await int.reply({
        ephemeral: true,
        content: `Successfully kicked ${userKick.tag}.\nReason: ${reason}`,
      });
    } catch (e) {
      console.error(e);
      await int.reply({
        content:
          "There was an error trying to kick that user. Please ensure I have the proper permissions and that the user is not a higher role.",
        ephemeral: true,
      });
    }
  },
};

export default kickCmd;
