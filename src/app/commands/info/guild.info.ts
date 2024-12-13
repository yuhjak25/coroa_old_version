import { getPreferredColor } from "../../../config/functions/color";
import { getPreferredLanguage } from "../../../config/functions/language";
import Category from "../../../config/interfaces/Category";
import { SlashCommandData } from "../../../config/types/types";
import translations from "../../../config/lang/translation.json";
import { ColorResolvable, EmbedBuilder } from "discord.js";

const guildInfo: SlashCommandData = {
  name: "server-info",
  description: "Shows the information of the server.",
  category: Category.inf,
  run: async (client, int, args) => {
    const guild = int.guild;
    const language = await getPreferredLanguage(int);
    if (!guild) {
      int.reply({
        content: translations.$commands["$guild.info.ts"].error[language],
        ephemeral: true,
      });
    }

    try {
      const language = await getPreferredLanguage(int);
      const color = await getPreferredColor(int);

      const guildId = guild?.id;
      const guildUsers = guild?.memberCount;
      const guildChannels = guild?.channels.cache.size;
      const rolesList = guild?.roles.cache
        .filter((role) => role.name !== "@everyone")
        .sort((a, b) => b.position - a.position)
        .map((role) => `<@&${role.id}>`)
        .slice(0, 20)
        .join(", ");
      const guildCreated = guild?.createdAt.toDateString();
      //@ts-ignore
      const guildOwner = (await guild?.fetchOwner()).user.tag;
      const guildRegion = guild?.preferredLocale;

      const guildInfoEmbed = new EmbedBuilder()
        .setAuthor({
          name: guild?.name!,
        })
        .setColor(color as ColorResolvable)
        .setThumbnail(guild?.iconURL() ?? "")
        .addFields(
          {
            name: translations.$commands["$guild.info.ts"].embed[".addFields"]
              .owner[language],
            value: `${guildOwner}`,
            inline: true,
          },
          {
            name: "ID: ",
            value: `\`\`\`${guildId}\`\`\``,
            inline: true,
          },
          {
            name: translations.$commands["$guild.info.ts"].embed[".addFields"]
              .users[language],
            value: `${guildUsers}`,
            inline: true,
          },
          {
            name: translations.$commands["$guild.info.ts"].embed[".addFields"]
              .channels[language],
            value: `${guildChannels}`,
            inline: true,
          },
          {
            name: translations.$commands["$guild.info.ts"].embed[".addFields"]
              .roleList[language],
            value: `${rolesList}`,
            inline: true,
          },
          {
            name: translations.$commands["$guild.info.ts"].embed[".addFields"]
              .createdAt[language],
            value: `\`${guildCreated}\``,
            inline: true,
          },
          {
            name: translations.$commands["$guild.info.ts"].embed[".addFields"]
              .region[language],
            value: `${guildRegion}`,
            inline: true,
          }
        )
        .setFooter({ text: translations.$global.footer[language] })
        .setTimestamp();

      await int.reply({
        embeds: [guildInfoEmbed],
      });
    } catch (err) {
      const language = await getPreferredLanguage(int);
      await int.reply(translations.$commands["$guild.info.ts"].error[language]);
      console.error(err);
    }
  },
};

export default guildInfo;
