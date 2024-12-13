import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ColorResolvable,
  EmbedBuilder,
  PermissionResolvable,
} from "discord.js";
import SettingModel from "../../../config/database/models/SettingModel";
import Category from "../../../config/interfaces/Category";
import { SlashCommandData } from "../../../config/types/types";
import translations from "../../../config/lang/translation.json";
import { getPreferredLanguage } from "../../../config/functions/language";
import { getPreferredColor } from "../../../config/functions/color";
import { hasPermissions } from "../../../config/functions/functions";

const requiredPermissions: PermissionResolvable[] = ["Administrator"];

const settingApp: SlashCommandData = {
  name: "config",
  description: "Configure the app.",
  category: Category.mod,
  memberPermissions: requiredPermissions,
  run: async (client, int, args) => {
    const guild = int.guild;
    const app = client.user;

    const userHasPermissions = await hasPermissions(int, requiredPermissions);
    if (!userHasPermissions) {
      return;
    }

    try {
      let settingApp = await SettingModel.findOne({
        guild_id: guild?.id,
      });

      if (!settingApp) {
        settingApp = await SettingModel.create({
          guild_id: guild?.id,
        });
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

      await int.reply({
        embeds: [settingEmbed],
        components: [settingButtons],
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

export default settingApp;
