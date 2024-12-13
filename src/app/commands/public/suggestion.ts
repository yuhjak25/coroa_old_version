import {
  ApplicationCommandOptionType,
  ColorResolvable,
  EmbedBuilder,
  PermissionResolvable,
  TextChannel,
} from "discord.js";
import Category from "../../../config/interfaces/Category";
import { SlashCommandData } from "../../../config/types/types";
import { getPreferredColor } from "../../../config/functions/color";
import { getPreferredLanguage } from "../../../config/functions/language";
import translations from "../../../config/lang/translation.json";
import SuggestionModel from "../../../config/database/models/SuggestionModel";

const requiredPermissions: PermissionResolvable[] = [
  "SendMessages",
  "UseApplicationCommands",
  "EmbedLinks",
];

const suggestion: SlashCommandData = {
  name: "suggestion",
  description: "Create a suggestion.",
  category: Category.gen,
  memberPermissions: requiredPermissions,
  options: [
    {
      name: "message",
      description: "The suggestion message.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, int, args) => {
    //@ts-ignore
    const suggestionMessage = int.options.getString("message");
    const user = int.user;
    const guild = int.guild;

    const language = await getPreferredLanguage(int);
    const color = await getPreferredColor(int);

    try {
      const suggestionService = await SuggestionModel.findOne({
        guild_id: guild?.id,
      });
      const embedSuggestions = new EmbedBuilder()
        .setAuthor({
          name: `Sugerencia de ${user.username}`,
          iconURL: user.displayAvatarURL(),
        })
        .setDescription(suggestionMessage)
        .setColor(color as ColorResolvable)
        .setFooter({ text: translations.$global.footer[language] })
        .setTimestamp();

      if (!suggestionService || !suggestionService.settings?.channel_id) {
        throw new Error("Suggestion channel not configured.");
      }

      const suggestionChannel = guild?.channels.cache.get(
        suggestionService.settings.channel_id
      ) as TextChannel;

      if (!suggestionChannel) {
        throw new Error("Suggestion channel not found.");
      }

      const sentMessage = await suggestionChannel.send({
        embeds: [embedSuggestions],
      });
      await sentMessage.react("🔼");
      await sentMessage.react("🔽");

      int.reply({
        content: "Your suggestion has been sent successfully!",
        ephemeral: true,
      });
    } catch (e) {
      console.log(e);
      int.reply({
        content: "An error occurred while trying to send the suggestion.",
        ephemeral: true,
      });
    }
  },
};
export default suggestion;
