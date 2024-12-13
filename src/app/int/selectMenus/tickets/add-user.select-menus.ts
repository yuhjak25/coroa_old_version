import { TextChannel } from "discord.js";
import TicketModel from "../../../../config/database/models/TicketModel";
import { SelectMenuData } from "../../../../config/types/types";

const addUserSelect: SelectMenuData = {
  customId: "add-user-select",
  run: async (client, int) => {
    const selectedUserId = int.values[0]; // Assuming `int.values` is an array with one value
    const guild = int.guild;
    const member = guild?.members.cache.get(selectedUserId);

    if (!member) {
      await int.reply({
        content: "Could not find the selected user in the guild.",
        ephemeral: true,
      });
      return;
    }

    try {
      const ticketService = await TicketModel.findOne({
        guild_id: guild?.id,
      });

      if (
        !ticketService ||
        !ticketService.settings?.userChannel?.user_channel_id
      ) {
        throw new Error("Transcript channel not configured.");
      }

      const ticketChannel = guild?.channels.cache.get(
        ticketService.settings.userChannel.user_channel_id
      ) as TextChannel;

      if (!ticketChannel) {
        throw new Error("Ticket channel not found.");
      }

      const permissions =
        ticketChannel.permissionOverwrites.cache.get(selectedUserId);

      if (permissions && permissions.allow.has("ViewChannel")) {
        await int.reply({
          content: "The user already has access to the ticket channel.",
          ephemeral: true,
        });
        return;
      }

      await ticketChannel.permissionOverwrites.create(member, {
        ViewChannel: true,
        SendMessages: true,
      });

      await int.reply({
        content: `Successfully added ${member.user.username} to the ticket channel.`,
        ephemeral: true,
      });
    } catch (e) {
      console.error(e);
      await int.reply({
        content: "An error occurred while trying to add the user.",
        ephemeral: true,
      });
    }
  },
};

export default addUserSelect;
