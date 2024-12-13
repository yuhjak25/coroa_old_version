import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ColorResolvable,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { ButtonData } from "../../../../config/types/types";
import translations from "../../../../config/lang/translation.json";
import { getPreferredLanguage } from "../../../../config/functions/language";
import { getPreferredColor } from "../../../../config/functions/color";

const langButton: ButtonData = {
  customId: "langButton",
  run: async (client, int) => {
    const guild = int.guild;
    const app = client.user;

    try {
      const language = await getPreferredLanguage(int);
      const color = await getPreferredColor(int);

      const settingEmbed = new EmbedBuilder()
        .setTitle(
          translations.$commands["$config.ts"].embeds[".setTitleLang"][
            language
          ].replace("${app.username}", app.username)
        )
        .setDescription(
          translations.$commands["$config.ts"].embeds[".setDescriptionLang"][
            language
          ].replace("${app.id}", app.id)
        )
        .setColor(color as ColorResolvable)
        .setFooter({ text: translations.$global.footer[language] });

      const settingSelectMenu =
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("langSelectMenu")
            .setPlaceholder(
              translations.$commands["$config.ts"]["select-menus"].placeholder
                .lang[language]
            )
            .setOptions([
              {
                emoji: "🇪🇸",
                label: "Español",
                description: "Español de España",
                value: "spanish",
              },
              {
                emoji: "🇬🇧",
                label: "English",
                description: "English from the UK",
                value: "english",
              },
            ])
            .setMinValues(1)
            .setMaxValues(1)
        );
      const settingButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("backButton")
          .setLabel(
            translations.$commands["$config.ts"].buttons.label.back[language]
          )
          .setStyle(ButtonStyle.Primary)
      );
      int.deferUpdate();
      int.message.edit({
        embeds: [settingEmbed],
        components: [settingSelectMenu, settingButton],
      });
    } catch (err) {
      const language = await getPreferredLanguage(int);
      await int.reply({
        content: translations.$commands["$config.ts"].error[language].replace(
          "${app.id}",
          app.id
        ),
        ephemeral: true,
      });
      console.log(err);
    }
  },
};

export default langButton;
