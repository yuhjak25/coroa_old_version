import {
  ApplicationCommandOptionType,
  ColorResolvable,
  EmbedBuilder,
  PermissionResolvable,
  TextChannel,
} from "discord.js";
import Category from "../../../config/interfaces/Category";
import { SlashCommandData } from "../../../config/types/types";
import SuggestionModel from "../../../config/database/models/SuggestionModel";
import appConfig from "../../../config/interfaces/Config";

const requiredPermissions: PermissionResolvable[] = [
  "AddReactions",
  "ManageMessages",
];

const rejectSuggestion: SlashCommandData = {
  name: "reject-suggestion",
  description: "Rejects a suggestion from a user.",
  category: Category.mod,
  memberPermissions: requiredPermissions,
  options: [
    {
      name: "message-id",
      description: "The ID of the suggestion message.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, int, args) => {
    //@ts-ignore
    const suggestionID = int.options.getString("message-id");
    const guild = int.guild;

    try {
      const suggestionService = await SuggestionModel.findOne({
        guild_id: guild?.id,
      });

      if (!suggestionService || !suggestionService.settings?.channel_id) {
        throw new Error("Suggestion channel not configured.");
      }

      const suggestionChannel = guild?.channels.cache.get(
        suggestionService.settings.channel_id
      ) as TextChannel;

      if (!suggestionChannel) {
        throw new Error("Suggestion channel not found.");
      }

      const suggestionMessage = await suggestionChannel.messages.fetch(
        suggestionID!
      );

      if (!suggestionMessage) {
        int.reply({
          content: "Suggestion message not found.",
          ephemeral: true,
        });
        return;
      }

      await suggestionMessage.reactions.removeAll();

      const embed = suggestionMessage.embeds[0];

      if (!embed) {
        int.reply({
          content: "The suggestion message does not contain an embed.",
          ephemeral: true,
        });
        return;
      }

      const updatedEmbed = EmbedBuilder.from(embed).setColor(
        appConfig.colors.red as ColorResolvable
      );

      await suggestionMessage.edit({ embeds: [updatedEmbed] });

      await suggestionMessage.react("❌");

      int.reply({
        content: "Suggestion rejected.",
        ephemeral: true,
      });
    } catch (e) {
      console.error(e);
      int.reply({
        content: "Error fetching the suggestion message.",
        ephemeral: true,
      });
    }
  },
};

export default rejectSuggestion;
