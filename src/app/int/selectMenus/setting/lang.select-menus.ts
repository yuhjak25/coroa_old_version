import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ColorResolvable,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import SettingModel from "../../../../config/database/models/SettingModel";
import { SelectMenuData } from "../../../../config/types/types";
import { getPreferredLanguage } from "../../../../config/functions/language";
import translations from "../../../../config/lang/translation.json";
import { getPreferredColor } from "../../../../config/functions/color";

const langSelectMenu: SelectMenuData = {
  customId: "langSelectMenu",
  run: async (client, int) => {
    const guild = int.guild;
    const app = client.user;
    const lang = int.values[0];

    try {
      if (lang) {
        const selectedLang = await SettingModel.findOneAndUpdate(
          { guild_id: guild?.id },
          { "settings.language": lang },
          { new: true }
        );
      }
      const language = await getPreferredLanguage(int);
      const color = await getPreferredColor(int);

      const settingEmbed = new EmbedBuilder()
        .setTitle(
          translations.$commands["$config.ts"].embeds[".setTitle"][language]
            .replace("${app.username}", app.username)
            .replace("${guild?.name}", guild?.name)
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
                default: lang === "spanish",
              },
              {
                emoji: "🇬🇧",
                label: "English",
                description: "English from the UK",
                value: "english",
                default: lang === "english",
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
export default langSelectMenu;
