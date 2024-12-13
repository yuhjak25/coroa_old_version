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
import appConfig from "../../../../config/interfaces/Config";
import { getPreferredLanguage } from "../../../../config/functions/language";
import translations from "../../../../config/lang/translation.json";

interface ColorOption {
  emoji: string;
  label: string;
  value: string;
}

const colorSelect: SelectMenuData = {
  customId: "colorSelect",
  run: async (client, int) => {
    const guild = int.guild;
    const app = client.user;
    const color = int.values[0];

    try {
      let selectedColor = color || "#c2ff0b";
      if (color) {
        const updatedSetting = await SettingModel.findOneAndUpdate(
          { guild_id: guild?.id },
          { "settings.color": color },
          { new: true }
        );
        selectedColor = updatedSetting?.settings?.color || color;
      } else {
        const currentSetting = await SettingModel.findOne(
          { guild_id: guild?.id },
          { "settings.color": 1 }
        );
        selectedColor =
          currentSetting?.settings?.color || appConfig.colors.Coroa;
      }

      const language = await getPreferredLanguage(int);

      const colorOptions: ColorOption[] = [
        {
          emoji: "<:LogoDiscordBot:1250909971244257510> ",
          label: "Coroa",
          value: "#c2ff0b",
        },
        {
          emoji: "🔴",
          label: translations.$global.colors.red[language],
          value: "#ed4245",
        },
        {
          emoji: "🟢",
          label: translations.$global.colors.green[language],
          value: "#57f287",
        },
        {
          emoji: "🔵",
          label: translations.$global.colors.blue[language],
          value: "#5865f2",
        },
        {
          emoji: "🟡",
          label: translations.$global.colors.yellow[language],
          value: "#fee75c",
        },
        {
          emoji: "⚫",
          label: translations.$global.colors.black[language],
          value: "#23272a",
        },
        {
          emoji: "⚪",
          label: translations.$global.colors.white[language],
          value: "#ffffff",
        },
      ];

      const settingEmbed = new EmbedBuilder()
        .setTitle(
          translations.$commands["$config.ts"].embeds[".setTitleColor"][
            language
          ]
        )
        .setDescription(
          translations.$commands["$config.ts"].embeds[".setDescriptionColor"][
            language
          ]
        )
        .setColor(selectedColor as ColorResolvable)
        .setFooter({ text: translations.$global.footer[language] });
      const settingSelectMenu =
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("colorSelect")
            .setPlaceholder(
              translations.$commands["$config.ts"]["select-menus"].placeholder
                .color[language]
            )
            .addOptions(
              colorOptions.map((option) => ({
                emoji: option.emoji,
                label: option.label,
                value: option.value,
                default: option.value === selectedColor,
              }))
            )
        );
      const settingButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("backButton")
          .setLabel(
            translations.$commands["$config.ts"].buttons.label.back[language]
          )
          .setStyle(ButtonStyle.Primary)
      );

      await int.deferUpdate();
      await int.message.edit({
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

export default colorSelect;
