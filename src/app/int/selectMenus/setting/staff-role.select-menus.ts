import { getPreferredLanguage } from "../../../../config/functions/language";
import { SelectMenuData } from "../../../../config/types/types";
import translations from "../../../../config/lang/translation.json";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ColorResolvable,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { getPreferredColor } from "../../../../config/functions/color";
import SettingModel from "../../../../config/database/models/SettingModel";

const staffRoleSelectMenu: SelectMenuData = {
  customId: "staffRoleSelectMenu",
  run: async (client, int) => {
    const guild = int.guild;
    const app = client.user;
    const adminRole = int.values;

    try {
      if (adminRole) {
        const selectedRole = await SettingModel.findOneAndUpdate(
          { guild_id: guild?.id },
          { "settings.admin_roles": adminRole },
          { new: true }
        );
      }
      const language = await getPreferredLanguage(int);
      const color = await getPreferredColor(int);

      const roleCollection = await guild?.roles.fetch();
      const filteredRoles = roleCollection?.filter(
        (role) => role.name !== "@everyone"
      );

      const roles =
        filteredRoles?.map((role) => ({
          label: role.name,
          description: "ID: " + role.id,
          value: role.id,
          default: adminRole.includes(role.id),
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
            .setPlaceholder("Select a role")
            .addOptions(roles)
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

export default staffRoleSelectMenu;
