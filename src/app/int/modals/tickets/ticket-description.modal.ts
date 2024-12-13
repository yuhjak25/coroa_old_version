import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ColorResolvable,
  EmbedBuilder,
} from "discord.js";
import TicketModel from "../../../../config/database/models/TicketModel";
import { ModalData } from "../../../../config/types/types";
import { getPreferredColor } from "../../../../config/functions/color";
import { getPreferredLanguage } from "../../../../config/functions/language";
import translations from "../../../../config/lang/translation.json";

const ticketDescription: ModalData = {
  customId: "ticket-modal",
  run: async (client, int) => {
    const guild = int.guild;
    const user = int.user;
    const message = int.fields.getTextInputValue("ticket-description");

    const color = await getPreferredColor(int);
    const language = await getPreferredLanguage(int);

    try {
      const existingChannel = guild?.channels.cache.find(
        (channel) =>
          channel.type === ChannelType.GuildText &&
          channel.name === `ticket-${user.id}`
      );

      if (existingChannel) {
        int.reply({
          content: `A ticket channel already exists for you! <#${existingChannel.id}>`,
          ephemeral: true,
        });
        return;
      }

      const userChannel = await guild?.channels.create({
        name: `ticket-${user.id}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: guild?.roles.everyone.id,
            deny: ["ViewChannel"],
          },
          {
            id: user.id,
            allow: [
              "ViewChannel",
              "SendMessages",
              "AttachFiles",
              "AddReactions",
              "UseApplicationCommands",
            ],
          },
        ],
      });

      await TicketModel.findOneAndUpdate(
        { guild_id: guild?.id },
        {
          $set: {
            "settings.userChannel.user_id": user.id,
            "settings.userChannel.user_channel_id": userChannel?.id,
          },
        },
        { new: true, upsert: true }
      );

      const newTicketEmbed = new EmbedBuilder()
        .setTitle(`New ticket from ${user.username}`)
        .setDescription(message)
        .setColor(color as ColorResolvable)
        .setThumbnail(user.displayAvatarURL())
        .setFooter({ text: translations.$global.footer[language] })
        .setTimestamp();
      const ticketActionButton =
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("add-user")
            .setLabel("Add")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("📩"),
          new ButtonBuilder()
            .setCustomId("close-ticket")
            .setLabel("Close")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("🔒")
        );
      int.reply({
        content: `Ticket created successfully! <#${userChannel?.id}>`,
        ephemeral: true,
      });

      await userChannel?.send({
        embeds: [newTicketEmbed],
        components: [ticketActionButton],
      });
    } catch (e) {
      console.error(e);
      int.reply({
        content: "error",
        ephemeral: true,
      });
    }
  },
};
export default ticketDescription;
