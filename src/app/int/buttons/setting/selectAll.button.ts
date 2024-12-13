import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ColorResolvable,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { ButtonData } from "../../../../config/types/types";
import { getPreferredLanguage } from "../../../../config/functions/language";
import { getPreferredColor } from "../../../../config/functions/color";
import translations from "../../../../config/lang/translation.json";
import SettingModel from "../../../../config/database/models/SettingModel";

const selectAllButton: ButtonData = {
  customId: "selectAllButton",
  run: async (client, int) => {
    const guild = int.guild;
    const app = client.user;

    try {
      const language = await getPreferredLanguage(int);
      const color = await getPreferredColor(int);

      const channelsCollection = guild?.channels.cache.filter(
        (channel) => channel.type === ChannelType.GuildText
      );

      const channels = channelsCollection?.map((channel) => ({
        label: channel.name,
        description: "ID: " + channel.id,
        value: channel.id,
        default: true,
      }));

      const updatedSettings = await SettingModel.findOneAndUpdate(
        { guild_id: guild?.id },
        {
          "settings.channel_block": channelsCollection?.map(
            (channel) => channel.id
          ),
        },
        { new: true, upsert: true }
      );

      const settingEmbed = new EmbedBuilder()
        .setTitle(
          translations.$commands["$config.ts"].embeds[".setTitleBlockChannel"][
            language
          ]
        )
        .setDescription(
          translations.$commands["$config.ts"].embeds[
            ".setDescriptionBlockChannel"
          ][language].replace("${app.id}", app.id)
        )
        .setColor(color as ColorResolvable)
        .setFooter({ text: translations.$global.footer[language] });
      const settingSelectMenu =
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("blockChannelSelect")
            .setPlaceholder(
              translations.$commands["$config.ts"]["select-menus"].placeholder
                .blockChannel[language]
            )
            .addOptions(channels || [])
            .setMaxValues(channels?.length || 0)
        );
      const settingButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("backButton")
          .setLabel(
            translations.$commands["$config.ts"].buttons.label.back[language]
          )
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("selectAllButton")
          .setLabel(
            translations.$commands["$config.ts"].buttons.label[
              "select-all-channels"
            ][language]
          )
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("removeAllButton")
          .setLabel(
            translations.$commands["$config.ts"].buttons.label[
              "remove-all-channels"
            ][language]
          )
          .setStyle(ButtonStyle.Danger)
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
export default selectAllButton;
