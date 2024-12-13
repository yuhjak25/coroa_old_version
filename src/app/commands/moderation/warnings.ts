import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ColorResolvable,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import Category from "../../../config/interfaces/Category";
import { SlashCommandData } from "../../../config/types/types";
import WarnModel from "../../../config/database/models/WarnModel";
import translations from "../../../config/lang/translation.json";
import { getPreferredLanguage } from "../../../config/functions/language";
import { getPreferredColor } from "../../../config/functions/color";

const warnings: SlashCommandData = {
  name: "warnings",
  description: "Shows a list of warnings of a user.",
  category: Category.mod,
  options: [
    {
      name: "user",
      description: "The user to see the warnings.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  run: async (client, int, args) => {
    //@ts-ignore
    const userWarns = int.options.getUser("user");
    const guild = int.guild;

    try {
      const language = await getPreferredLanguage(int);
      const color = await getPreferredColor(int);

      const warnRecord = await WarnModel.findOne({
        guild_id: guild?.id,
        "settings.user_id": userWarns.id,
      });

      if (warnRecord) {
        const warningsCount = warnRecord.settings?.warns;
        const warningReasons = warnRecord.settings?.reasons;

        if (warningsCount && warningReasons) {
          const warningsEmbed = new EmbedBuilder()
            .setAuthor({
              name: translations.$commands["$warnings.ts"].embed[".setAuthor"][
                language
              ].replace("${userWarns.username}", userWarns.username),
            })
            .setThumbnail(userWarns.displayAvatarURL())
            .addFields(
              {
                name: translations.$commands["$warnings.ts"].embed[".addFields"]
                  .warns[language],
                value: `\`${warnRecord.settings?.warns}\``,
                inline: true,
              },
              {
                name: translations.$commands["$warnings.ts"].embed[".addFields"]
                  .reason[language],
                value: warningReasons.join("\n"),
                inline: true,
              }
            )
            .setColor(color as ColorResolvable)
            .setFooter({ text: translations.$global.footer[language] });

          const options = warningReasons.map((reason, index) => ({
            label:
              translations.$commands["$warnings.ts"]["select-menu"].options[
                language
              ] + ` ${index + 1}`,
            description: reason,
            value: `${userWarns.id}_warn_${index + 1}`,
          }));

          const selectWarn =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
              new StringSelectMenuBuilder()
                .setCustomId("selectWarn")
                .setPlaceholder(
                  translations.$commands["$warnings.ts"]["select-menu"][
                    "place-holder"
                  ][language]
                )
                .addOptions(options)
                .setMinValues(1)
            );

          await int.reply({
            embeds: [warningsEmbed],
            components: [selectWarn],
          });
        }
      } else {
        await int.reply({
          content:
            translations.$commands["$warnings.ts"].error.noWarns[language],
          ephemeral: true,
        });
      }
    } catch (err) {
      const language = await getPreferredLanguage(int);
      await int.reply({
        content:
          translations.$commands["$warnings.ts"].error.genError[language],
        ephemeral: true,
      });
      console.log(err);
    }
  },
};

export default warnings;
