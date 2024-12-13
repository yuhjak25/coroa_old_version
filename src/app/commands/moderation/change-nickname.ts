import { ApplicationCommandOptionType, PermissionResolvable } from "discord.js";
import Category from "../../../config/interfaces/Category";
import { SlashCommandData } from "../../../config/types/types";

const requiredPermissions: PermissionResolvable[] = [
  "SendMessages",
  "UseApplicationCommands",
  "ModerateMembers",
  "ManageNicknames",
  "ChangeNickname",
];

const changeNickname: SlashCommandData = {
  name: "nickname",
  description: "Change the name of a user to a moderated one.",
  category: Category.mod,
  memberPermissions: requiredPermissions,
  options: [
    {
      name: "user",
      description: "The user to change the nickname.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],

  run: async (client, int, args) => {
    //@ts-ignore
    const userChangeNickName = int.options.getUser("user");
    const guild = int.guild;

    if (!guild) {
      int.reply({
        content: "This command can only be used in a server.",
        ephemeral: true,
      });
      return;
    }

    const member = await guild.members.fetch(userChangeNickName.id);

    if (int.user.id === userChangeNickName.id) {
      int.reply({
        content: "No puedes cambiarte el nombre a ti mismo.",
        ephemeral: true,
      });
      return;
    }

    try {
      const randomNumber = Math.floor(Math.random() * 10000);

      await member.setNickname("Random name " + randomNumber);

      int.reply({
        content: `Changed name from \`${member.user.username}\` to ${
          member.nickname || "Random name" + randomNumber
        }`,
        ephemeral: true,
      });
    } catch (e) {
      int.reply({
        content: "Error changing the nickname.",
        ephemeral: true,
      });
      console.log(e);
    }
  },
};

export default changeNickname;
