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

const rolButton: ButtonData = {
  customId: "rolButton",
  run: async (client, int) => {
    const guild = int.guild;
    const app = client.user;

    try {
      const language = await getPreferredLanguage(int);
      const color = await getPreferredColor(int);

      const roleCollection = await int.guild?.roles.fetch();
      const filteredRoles = roleCollection?.filter(
        (role) => role.name !== "@everyone"
      );
      const roles =
        filteredRoles?.map((role) => ({
          label: role.name,
          description: "ID: " + role.id,
          value: role.id,
        })) || [];

      const settingEmbed = new EmbedBuilder()
        .setTitle(
          translations.$commands["$config.ts"].embeds[".setTitleStaffRole"][
            language
          ]
        )
        .setDescription(
          translations.$commands["$config.ts"].embeds[
            ".setDescriptionStaffRole"
          ][language]
        )
        .setColor(color as ColorResolvable)
        .setFooter({ text: translations.$global.footer[language] });
      const settingSelectMenu =
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("staffRoleSelectMenu")
            .setPlaceholder(
              translations.$commands["$config.ts"]["select-menus"].placeholder
                .staffRole[language]
            )
            .setOptions(roles)
            .setMinValues(1)
            .setMaxValues(roles.length)
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

export default rolButton;
