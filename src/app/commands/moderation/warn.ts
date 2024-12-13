import {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  PermissionResolvable,
} from "discord.js";
import Category from "../../../config/interfaces/Category";
import { SlashCommandData } from "../../../config/types/types";
import WarnModel from "../../../config/database/models/WarnModel";
import { getPreferredLanguage } from "../../../config/functions/language";
import translations from "../../../config/lang/translation.json";
import { hasPermissions } from "../../../config/functions/functions";

const MAX_REASON_LENGTH = 100;
const requiredPermissions: PermissionResolvable[] = [
  "BanMembers",
  "ModerateMembers",
];

const warnCmd: SlashCommandData = {
  name: "warn",
  description: "Give a warn to a user.",
  category: Category.mod,
  memberPermissions: requiredPermissions,
  options: [
    {
      name: "user",
      description: "The user to give the warn.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "reason",
      description: "The reason for giving a warn.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  run: async (client, int, args) => {
    //@ts-ignore
    const userWarn = int.options.getUser("user");
    //@ts-ignore
    const reason = int.options.getString("reason") || "NaN";
    const guild = int.guild;
    const user = int.user;

    const language = await getPreferredLanguage(int);
    const userHasPermissions = await hasPermissions(int, requiredPermissions);
    if (!userHasPermissions) {
      return;
    }

    if (user.id === userWarn.id) {
      int.reply({
        content: "No puedes ponerte un aviso a ti mismo.",
        ephemeral: true,
      });
      return;
    }

    try {
      if (reason.length > MAX_REASON_LENGTH) {
        int.reply({
          content: `The reason must be ${MAX_REASON_LENGTH} characters or less.`,
          ephemeral: true,
        });
        return;
      }

      let warnRecord = await WarnModel.findOne({
        guild_id: guild?.id,
        "settings.user_id": userWarn.id,
      });

      if (!warnRecord) {
        warnRecord = new WarnModel({
          guild_id: guild?.id,
          settings: {
            user_id: userWarn.id,
            mod_id: int.user.id,
            warns: 1,
            reasons: [reason],
          },
        });
        await warnRecord.save();

        int.reply({
          content: translations.$commands["$warn.ts"].respond.firstWarn[
            language
          ]
            .replace("${userWarn.id}", userWarn.id)
            .replace(
              "${warnRecord?.settings?.warns}",
              warnRecord?.settings?.warns?.toString()
            ),
        });
        return;
      } else {
        if (!warnRecord.settings) {
          warnRecord.settings = {
            user_id: userWarn.id,
            mod_id: int.user.id,
            warns: 0,
            reasons: [],
          };
        }

        warnRecord.settings.warns = (warnRecord.settings.warns || 0) + 1;
        warnRecord.settings.reasons.push(reason);
        await warnRecord.save();

        if (warnRecord.settings.warns === 3) {
          if (
            !guild?.members.me?.permissions.has(PermissionFlagsBits.BanMembers)
          ) {
            int.reply({
              content: "I don't have permissions to ban members.",
              ephemeral: true,
            });
            return;
          }

          await guild.members.ban(userWarn.id, {
            reason:
              translations.$commands["$warn.ts"].respond.thirdWarn.ban[
                language
              ],
          });

          await WarnModel.findOneAndDelete({
            guild_id: guild.id,
            "settings.user_id": userWarn.id,
          });

          int.reply({
            content: translations.$commands["$warn.ts"].respond.thirdWarn[
              language
            ]
              .replace("${userWarn.id}", userWarn.id)
              .replace(
                "${warnRecord?.settings?.warns}",
                warnRecord?.settings?.warns.toString()
              ),
          });
          return;
        } else {
          int.reply({
            content: translations.$commands["$warn.ts"].respond.secondWarn[
              language
            ]
              .replace("${userWarn.id}", userWarn.id)
              .replace(
                "${warnRecord?.settings?.warns}",
                warnRecord?.settings?.warns.toString()
              ),
          });
          return;
        }
      }
    } catch (err) {
      console.log(err);
      int.reply({
        content: translations.$commands["$warn.ts"].error[language],
        ephemeral: true,
      });
      return;
    }
  },
};

export default warnCmd;
