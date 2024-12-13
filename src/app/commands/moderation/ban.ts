import { ApplicationCommandOptionType, PermissionResolvable } from "discord.js";
import Category from "../../../config/interfaces/Category";
import { SlashCommandData } from "../../../config/types/types";
import { getPreferredLanguage } from "../../../config/functions/language";
import translations from "../../../config/lang/translation.json";
import { hasPermissions } from "../../../config/functions/functions";

const requiredPermissions: PermissionResolvable[] = [
  "SendMessages",
  "UseApplicationCommands",
  "BanMembers",
];

const banCmd: SlashCommandData = {
  name: "ban",
  description: "Ban a user from the server.",
  category: Category.mod,
  memberPermissions: requiredPermissions,
  options: [
    {
      name: "user",
      description: "The user to ban.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "reason",
      description: "The reason for banning the user.",
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "delete-messages",
      description: "Delete the user's messages.",
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: "Don't delete",
          value: "none",
        },
        {
          name: "1 hour",
          value: "1h",
        },
        {
          name: "6 hours",
          value: "6h",
        },
        {
          name: "12 hours",
          value: "12h",
        },
        {
          name: "24 hours",
          value: "24h",
        },
        {
          name: "3 days",
          value: "3d",
        },
        {
          name: "7 days",
          value: "7d",
        },
      ],
    },
  ],
  run: async (client, int, args) => {
    //@ts-ignore
    const userBan = int.options.getUser("user");
    //@ts-ignore
    const reason = int.options.getString("reason") || "No reason provided";
    //@ts-ignore
    const deleteMessages = int.options.getString("delete-messages");

    const userHasPermissions = await hasPermissions(int, requiredPermissions);
    if (!userHasPermissions) {
      return;
    }

    const language = await getPreferredLanguage(int);
    try {
      if (!userBan) {
        int.reply({
          content: translations.$commands["$ban.ts"].error.errorUser[language],
          ephemeral: true,
        });
        return;
      }

      await int.guild?.members.ban(userBan, {
        reason: translations.$commands["$ban.ts"].guildBan[language]
          .replace("${int.user.username}", int.user.username)
          .replace("${reason}", reason),
      });

      let deletedMessages = false;
      if (deleteMessages && deleteMessages !== "none") {
        const deleteDuration = parseDeleteDuration(deleteMessages);
        if (deleteDuration > 0) {
          const messages = await int.channel?.messages.fetch({
            limit: 100,
          });
          if (messages) {
            const filteredMessages = messages.filter(
              (msg) =>
                msg.author.id === userBan.id &&
                msg.createdTimestamp >= Date.now() - deleteDuration
            );
            //@ts-ignore
            await int.channel?.bulkDelete(filteredMessages);
            deletedMessages = true;
          }
        }
      }

      const replyMessage = deletedMessages
        ? translations.$commands["$ban.ts"].reply.MessageDelete[language]
            .replace("${userBan.id}", userBan.id)
            .replace("${reason}", reason)
        : translations.$commands["$ban.ts"].reply.noMessageDelete[language]
            .replace("${userBan.id}", userBan.id)
            .replace("${reason}", reason);

      int.reply({
        content: replyMessage,
      });
    } catch (err) {
      console.error("Error banning user and deleting messages:", err);
      int.reply({
        content: translations.$commands["$ban.ts"].error.errorBan[language],
        ephemeral: true,
      });
    }
  },
};

function parseDeleteDuration(durationString: string): number {
  const regex = /^(\d+)([hd])$/;
  const match = durationString.match(regex);
  if (match) {
    const number = parseInt(match[1]);
    const unit = match[2];
    if (unit === "h") {
      return number * 60 * 60 * 1000;
    } else if (unit === "d") {
      return number * 24 * 60 * 60 * 1000;
    }
  }
  return 0;
}

export default banCmd;
