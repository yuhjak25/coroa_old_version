import Category from "../../../config/interfaces/Category";
import { SlashCommandData } from "../../../config/types/types";
import { ColorResolvable, EmbedBuilder } from "discord.js";
import { getPreferredColor } from "../../../config/functions/color";
import { getPreferredLanguage } from "../../../config/functions/language";
import translations from "../../../config/lang/translation.json";

const helpCommand: SlashCommandData = {
  name: "help",
  description: "Sends the commands with a description",
  category: Category.inf,
  run: async (client, int, args) => {
    const language = await getPreferredLanguage(int);
    const color = await getPreferredColor(int);

    try {
      const helpEmbed = new EmbedBuilder()
        .setDescription(
          translations.$commands["$help.ts"].embeds[".setDescription"][language]
        )
        .setColor(color as ColorResolvable)
        .setFooter({ text: translations.$global.footer[language] });

      await int.reply({ embeds: [helpEmbed], ephemeral: true });
    } catch (err) {
      console.log(err);
      await int.reply({
        content: "Ocurrió un error al intentar mostrar los comandos de ayuda.",
        ephemeral: true,
      });
    }
  },
};

export default helpCommand;
