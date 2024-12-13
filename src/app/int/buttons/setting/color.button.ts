import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ColorResolvable,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { ButtonData } from "../../../../config/types/types";
import { getPreferredLanguage } from "../../../../config/functions/language";
import translations from "../../../../config/lang/translation.json";
import { getPreferredColor } from "../../../../config/functions/color";

const colorButton: ButtonData = {
  customId: "colorButton",
  run: async (client, int) => {
    const guild = int.guild;
    const app = client.user;

    try {
      const language = await getPreferredLanguage(int);
      const color = await getPreferredColor(int);

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
        .setColor(color as ColorResolvable)
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
export default colorButton;
