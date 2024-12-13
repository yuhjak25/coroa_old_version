import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ColorResolvable,
  EmbedBuilder,
  PermissionResolvable,
} from "discord.js";
import Category from "../../../config/interfaces/Category";
import { SlashCommandData } from "../../../config/types/types";
import { hasPermissions } from "../../../config/functions/functions";
import TicketModel from "../../../config/database/models/TicketModel";
import { getPreferredColor } from "../../../config/functions/color";
import { getPreferredLanguage } from "../../../config/functions/language";
import translations from "../../../config/lang/translation.json";

const requiredPermissions: PermissionResolvable[] = ["Administrator"];

const createTicket: SlashCommandData = {
  name: "create-ticket",
  description: "Configures the ticket service.",
  category: Category.tic,
  memberPermissions: requiredPermissions,
  options: [
    {
      name: "channel",
      description: "The channel where tickets will be created.",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "transcript-channel",
      description: "The channel where tickets log will be sent.",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "message",
      description: "The message to be sent on the embed to the ticket message.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, int, args) => {
    //@ts-ignore
    const channelTicketSend = int.options.getChannel("channel");
    //@ts-ignore
    const transcriptChannel = int.options.getChannel("transcript-channel");
    //@ts-ignore
    const message = int.options.getString("message");

    const color = await getPreferredColor(int);
    const language = await getPreferredLanguage(int);
    const guild = int.guild;

    if (!guild) {
      int.reply({
        content: "You must be in a server to use this command.",
        ephemeral: true,
      });
      return;
    }

    if (
      (!channelTicketSend && !transcriptChannel) ||
      (channelTicketSend.type &&
        transcriptChannel.type !== ChannelType.GuildText)
    ) {
      int.reply({
        content:
          "You must provide both a channel for ticket creation and a channel for transcript logging.",
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
      const ticketService = await TicketModel.findOne({ guild_id: guild.id });

      if (ticketService) {
        int.reply({
          content: "A ticket service is already configured for this server.",
          ephemeral: true,
        });
      } else {
        await TicketModel.create({
          guild_id: guild.id,
          settings: {
            channel_id: channelTicketSend.id,
            transcript_channel_id: transcriptChannel.id,
          },
        });
        int.reply({
          content: "Ticket service configured successfully.",
          ephemeral: true,
        });
        const ticketEmbed = new EmbedBuilder()
          .setTitle(`Open a ticket in ${guild.name}.`)
          .setDescription(message)
          .setThumbnail(guild.iconURL())
          .setFooter({ text: translations.$global.footer[language] })
          .setColor(color as ColorResolvable);
        const ticketButton =
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId("create-ticket")
              .setLabel("Ticket")
              .setEmoji("✉️")
              .setStyle(ButtonStyle.Primary)
          );
        channelTicketSend.send({
          embeds: [ticketEmbed],
          components: [ticketButton],
        });
      }
    } catch (e) {
      console.error(e);
      int.reply({
        content: "An error occurred while creating the ticket.",
        ephemeral: true,
      });
    }
  },
};

export default createTicket;
