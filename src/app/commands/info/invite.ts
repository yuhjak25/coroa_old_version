import {
  ColorResolvable,
  EmbedBuilder,
  PermissionResolvable,
} from "discord.js";
import Category from "../../../config/interfaces/Category";
import { SlashCommandData } from "../../../config/types/types";
import { getPreferredColor } from "../../../config/functions/color";
import translations from "../../../config/lang/translation.json";
import { getPreferredLanguage } from "../../../config/functions/language";

const requiredPermissions: PermissionResolvable[] = [
  "SendMessages",
  "UseApplicationCommands",
];

const inviteCmd: SlashCommandData = {
  name: "invite",
  description: "Send the link to invite the app to a server.",
  category: Category.inf,
  memberPermissions: requiredPermissions,
  run: async (client, int, args) => {
    const language = await getPreferredLanguage(int);
    const color = await getPreferredColor(int);

    try {
      const inviteEmbed = new EmbedBuilder()
        .setTitle("Coroa - Discord App")
        .setURL(
          "https://discord.com/oauth2/authorize?client_id=1238962260827836526&permissions=8&scope=applications.commands+bot"
        )
        .setDescription(
          "Coroa es una aplicación de Discord diseñada para mejorar la experiencia de los usuarios y facilitar las funciones de moderación."
        )
        .setColor(color as ColorResolvable)
        .setThumbnail(int.client.user.displayAvatarURL())
        .setFooter({
          text: translations.$global.footer[language],
        });
      await int.reply({
        embeds: [inviteEmbed],
      });
    } catch (e) {
      int.reply({
        content: "error",
        ephemeral: true,
      });
      console.log(e);
    }
  },
};
export default inviteCmd;
