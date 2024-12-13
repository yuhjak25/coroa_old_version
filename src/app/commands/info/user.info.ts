import {
  ApplicationCommandOptionType,
  ColorResolvable,
  EmbedBuilder,
} from "discord.js";
import Category from "../../../config/interfaces/Category";
import { SlashCommandData } from "../../../config/types/types";
import { getPreferredLanguage } from "../../../config/functions/language";
import { getPreferredColor } from "../../../config/functions/color";
import translations from "../../../config/lang/translation.json";

const statusEmojis = {
  online: "<:online:1223415124820234290>",
  dnd: "<:dnd:1223415167144955915>",
  idle: "<:idle:1223415182722863216>",
  offline: "<:offline:1223415153249357874>",
};

const userInfo: SlashCommandData = {
  name: "user-info",
  description: "Shows the information of a user.",
  category: Category.inf,
  options: [
    {
      name: "user",
      description: "The user to show the information.",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],
  run: async (client, int) => {
    try {
      let member;
      //@ts-ignore
      if (int.options.getUser("user")) {
        //@ts-ignore
        member = await int.guild?.members.fetch(int.options.getUser("user").id);
      } else {
        member = int.member;
      }

      if (!member) {
        throw new Error("Member not found.");
      }

      const language = await getPreferredLanguage(int);
      const color = await getPreferredColor(int);

      const userRoles = member.roles.cache
        .map((role) =>
          role.name === "@everyone" ? "@everyone" : `<@&${role.id}>`
        )
        .join(", ");
      const userId = member.id;
      const userNickname =
        member.nickname ||
        translations.$commands["$user.info.ts"].altInfo.none[language];
      const userStatus = member.presence?.status || [language];
      const userJoined =
        member.joinedAt?.toLocaleString() ||
        translations.$commands["$user.info.ts"].altInfo.unknow[language];
      const userCreated =
        member.user.createdAt?.toLocaleString() ||
        translations.$commands["$user.info.ts"].altInfo.unknow[language];
      const statusEmoji = statusEmojis[userStatus] || statusEmojis.offline;

      const userInfoEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${translations.$commands["$user.info.ts"].embed[".setAuthor"][language]} ${member.user.username}`,
        })
        .setColor(color as ColorResolvable)
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
          {
            name: "ID: ",
            value: `\`\`\`${userId}\`\`\``,
            inline: true,
          },
          {
            name: translations.$commands["$user.info.ts"].embed[".addFields"]
              .nickname[language],
            value: userNickname,
            inline: true,
          },
          {
            name: translations.$commands["$user.info.ts"].embed[".addFields"]
              .status[language],
            value: `${statusEmoji} ${userStatus}`,
            inline: true,
          },
          {
            name: "Rol(es):",
            value:
              userRoles ||
              translations.$commands["$user.info.ts"].altInfo.none[language],
            inline: true,
          },
          {
            name: translations.$commands["$user.info.ts"].embed[".addFields"]
              .joinedAt[language],
            value: `\`${userJoined}\``,
            inline: true,
          },
          {
            name: translations.$commands["$user.info.ts"].embed[".addFields"]
              .createdAt[language],
            value: `\`${userCreated}\``,
            inline: true,
          }
        )
        .setFooter({ text: translations.$global.footer[language] })
        .setTimestamp();

      int.reply({
        embeds: [userInfoEmbed],
      });
    } catch (err) {
      int.reply({
        content: "Error fetching member information.",
        ephemeral: true,
      });
      console.error("Error fetching member info:", err);
    }
  },
};

export default userInfo;
