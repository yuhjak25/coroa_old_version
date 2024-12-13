import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import { ButtonData } from "../../../../config/types/types";

const addUserButton: ButtonData = {
  customId: "add-user",
  run: async (client, int) => {
    const guild = int.guild;

    if (!guild) {
      await int.reply({
        content: "Guild not found.",
        ephemeral: true,
      });
      return;
    }

    try {
      const members = await guild.members.fetch();
      if (!members.size) {
        throw new Error("No members found in the guild.");
      }

      const options = members.map((member) => ({
        label: member.user.tag,
        value: member.id,
      }));

      const selectUserToAdd =
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("add-user-select")
            .setPlaceholder("Select a user")
            .addOptions(options)
            .setMinValues(1)
            .setMaxValues(1)
        );

      await int.reply({
        content: "Select a user to add:",
        components: [selectUserToAdd],
        ephemeral: true,
      });
    } catch (e) {
      console.error(e);
      await int.reply({
        content: "An error occurred while fetching users.",
        ephemeral: true,
      });
    }
  },
};

export default addUserButton;
