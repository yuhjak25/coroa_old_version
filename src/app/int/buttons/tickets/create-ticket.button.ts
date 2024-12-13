import { ButtonData } from "../../../../config/types/types";

import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

const createTicket: ButtonData = {
  customId: "create-ticket",
  run: async (client, int) => {
    const guild = int.guild;

    if (!guild) {
      int.reply({
        content: "You must be in a server to use this command.",
        ephemeral: true,
      });
      return;
    }

    try {
      const ticketModal = new ModalBuilder()
        .setCustomId("ticket-modal")
        .setTitle("Create Ticket");

      const descriptionModal =
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("ticket-description")
            .setLabel("Description")
            .setPlaceholder("Enter the description for your ticket")
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(10)
            .setMaxLength(4000)
            .setRequired(true)
        );

      ticketModal.addComponents(descriptionModal);

      await int.showModal(ticketModal);
    } catch (e) {
      console.log(e);
      int.reply({
        content: "An error occurred while creating the ticket.",
        ephemeral: true,
      });
    }
  },
};

export default createTicket;
