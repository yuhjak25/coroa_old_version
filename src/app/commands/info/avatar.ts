import {
  ApplicationCommandOptionType,
  ColorResolvable,
  EmbedBuilder,
  PermissionResolvable,
} from "discord.js";
import Category from "../../../config/interfaces/Category";
import { SlashCommandData } from "../../../config/types/types";
import { getPreferredLanguage } from "../../../config/functions/language";
import { getPreferredColor } from "../../../config/functions/color";
import translations from "../../../config/lang/translation.json";
import { hasPermissions } from "../../../config/functions/functions";

const requiredPermissions: PermissionResolvable[] = [
  "SendMessages",
  "UseApplicationCommands",
];

const avatar: SlashCommandData = {
  name: "avatar",
  description: "Shows your profile picture.",
  category: Category.inf,
  memberPermissions: requiredPermissions,
  options: [
    {
      name: "user",
      description: "Shows the profile of a user.",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],
  run: async (client, int, args) => {
    //@ts-ignore
    const userAvatar = int.options.getUser("user");
    const language = await getPreferredLanguage(int);
    const color = await getPreferredColor(int);

    const userHasPermissions = hasPermissions(int, requiredPermissions);
    if (!userHasPermissions) {
      return;
    }

    try {
      let avatarEmbed;
      if (!userAvatar) {
        avatarEmbed = new EmbedBuilder()
          .setDescription(`**Avatar de <@${int.user.id}>**`)
          .setImage(int.user.displayAvatarURL({ size: 1024 }))
          .setColor(color as ColorResolvable)
          .setFooter({ text: translations.$global.footer[language] })
          .setTimestamp();
      } else {
        avatarEmbed = new EmbedBuilder()
          .setImage(userAvatar.displayAvatarURL({ size: 1024 }))
          .setDescription(`**Avatar de <@${userAvatar.id}>**`)
          .setColor(color as ColorResolvable)
          .setFooter({ text: translations.$global.footer[language] })
          .setTimestamp();
      }

      int.reply({
        embeds: [avatarEmbed],
      });
    } catch (e) {
      console.error(e);
      int.reply({
        content: "An error occurred while trying to fetch the avatar.",
        ephemeral: true,
      });
    }
  },
};

export default avatar;
