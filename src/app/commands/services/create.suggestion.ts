import {
  ApplicationCommandOptionType,
  ChannelType,
  GuildChannel,
  PermissionResolvable,
} from "discord.js";
import { SlashCommandData } from "../../../config/types/types";
import Category from "../../../config/interfaces/Category";
import { hasPermissions } from "../../../config/functions/functions";
import SuggestionModel from "../../../config/database/models/SuggestionModel";

const requiredPermissions: PermissionResolvable[] = ["Administrator"];

const createSuggestion: SlashCommandData = {
  name: "create-suggestion",
  description: "Create a new suggestion for the server",
  category: Category.mod,
  memberPermissions: requiredPermissions,
  options: [
    {
      name: "channel",
      description: "Channel to create the suggestion.",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],
  run: async (client, int, args) => {
    //@ts-ignore
    const channel = int.options.getChannel("channel");
    const guild = int.guild;
    if (!channel || channel.type !== ChannelType.GuildText) {
      int.reply({
        content: "Please provide a valid text channel.",
        ephemeral: true,
      });
      return;
    }

    const userHasPermissions = await hasPermissions(int, requiredPermissions);

    if (!userHasPermissions) {
      int.reply({
        content:
          "You do not have the required permissions to use this command.",
        ephemeral: true,
      });
      return;
    }

    try {
      const suggestionService = await SuggestionModel.findOne({
        guild_id: guild?.id,
      });

      if (suggestionService) {
        int.reply({
          content: "A suggestion service is already running for this server.",
          ephemeral: true,
        });
      } else {
        await SuggestionModel.create({
          guild_id: int.guild?.id,
          settings: {
            channel_id: channel.id,
          },
        });
        int.reply({
          content: "Suggestion service created successfully.",
          ephemeral: true,
        });
      }
    } catch (e) {
      console.log(e);
      int.reply({
        content: "An error occurred while creating the suggestion.",
        ephemeral: true,
      });
    }
  },
};
export default createSuggestion;
