import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ColorResolvable,
  EmbedBuilder,
} from "discord.js";
import SettingModel from "../../../../config/database/models/SettingModel";
import { ButtonData } from "../../../../config/types/types";
import translations from "../../../../config/lang/translation.json";
import { getPreferredLanguage } from "../../../../config/functions/language";
import { getPreferredColor } from "../../../../config/functions/color";

const backButton: ButtonData = {
  customId: "backButton",
  run: async (client, int) => {
    const guild = int.guild;
    const app = client.user;

    try {
      const settingApp = await SettingModel.findOne({
        guild_id: guild?.id,
      });

      if (!settingApp) {
        await SettingModel.create({
          guild_id: guild?.id,
        });
      } else {
        const language = await getPreferredLanguage(int);
        const color = await getPreferredColor(int);

        const settingEmbed = new EmbedBuilder()
          .setTitle(
            translations.$commands["$config.ts"].embeds[".setTitle"][language]
              .replace("${app.username}", app.username)
              .replace("${guild?.name}", guild?.name)
          )
          .setDescription(
            translations.$commands["$config.ts"].embeds[".setDescription"][
              language
            ].replace("${app.id}", app.id)
          )
          .setColor(color as ColorResolvable)
          .setThumbnail(guild?.iconURL()!)
          .setFooter({ text: translations.$global.footer[language] });

        const settingButtons =
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId("langButton")
              .setLabel(
                translations.$commands["$config.ts"].buttons.label.language[
                  language
                ]
              )
              .setStyle(ButtonStyle.Primary)
              .setEmoji(
                translations.$commands["$config.ts"].buttons.emoji[language]
              ),
            new ButtonBuilder()
              .setCustomId("colorButton")
              .setLabel("Color")
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("rolButton")
              .setLabel(
                translations.$commands["$config.ts"].buttons.label.rol[language]
              )
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("blockChannelButton")
              .setLabel(
                translations.$commands["$config.ts"].buttons.label[
                  "block-channels"
                ][language]
              )
              .setStyle(ButtonStyle.Secondary)
          );

        int.deferUpdate();
        int.message.edit({
          embeds: [settingEmbed],
          components: [settingButtons],
        });
      }
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
export default backButton;
