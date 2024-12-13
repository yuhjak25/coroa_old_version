import { TextChannel } from "discord.js";
import { ButtonData } from "../../../../config/types/types";
import { createTranscript } from "discord-html-transcripts";
import TicketModel from "../../../../config/database/models/TicketModel";

const closeTicket: ButtonData = {
  customId: "close-ticket",
  run: async (client, int) => {
    const guild = int.guild;

    try {
      const channel = (await guild?.channels.fetch(
        int.channelId
      )) as TextChannel;

      if (!channel) {
        throw new Error("Channel not found");
      }

      await int.reply({
        content: "El ticket se cerrara en 15 segundos.",
        ephemeral: true,
      });

      const transcript = await createTranscript(channel);

      const ticketService = await TicketModel.findOne({
        guild_id: guild?.id,
      });

      if (!ticketService || !ticketService.settings?.transcript_channel_id) {
        throw new Error("Transcript channel not configured.");
      }

      const transcriptChannel = guild?.channels.cache.get(
        ticketService.settings.transcript_channel_id
      ) as TextChannel;

      if (!transcriptChannel) {
        throw new Error("Transcript channel not found.");
      }

      await transcriptChannel.send({
        content: `Ticket cerrado por <@${int.user.id}>.`,
        files: [transcript],
      });

      setTimeout(() => {
        channel.delete();
      }, 15000);
    } catch (e) {
      console.error(e);
      int.reply({
        content:
          "An error occurred while closing the ticket. Please try again later.",
        ephemeral: true,
      });
    }
  },
};

export default closeTicket;
