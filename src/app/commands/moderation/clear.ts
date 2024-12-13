import {
  ApplicationCommandOptionType,
  PermissionResolvable,
  TextChannel,
  Message,
} from "discord.js";
import Category from "../../../config/interfaces/Category";
import { SlashCommandData } from "../../../config/types/types";

const requiredPermissions: PermissionResolvable[] = [
  "ManageMessages",
  "SendMessages",
  "UseApplicationCommands",
];

const clearCmd: SlashCommandData = {
  name: "clear",
  description: "Deletes an amount of messages.",
  category: Category.mod,
  memberPermissions: requiredPermissions,
  options: [
    {
      name: "amount",
      description: "Select the number of messages to delete.",
      type: ApplicationCommandOptionType.Integer,
      required: true,
      choices: [
        { name: "5", value: 5 },
        { name: "10", value: 10 },
        { name: "20", value: 20 },
        { name: "50", value: 50 },
        { name: "100", value: 100 },
      ],
    },
  ],

  run: async (client, int, args) => {
    //@ts-ignore
    const amount = int.options.getInteger("amount");

    if (amount && amount > 0) {
      const channel = int.channel as TextChannel;

      if (channel) {
        try {
          let deletedMessages = 0;
          if (amount <= 100) {
            const messages = await channel.bulkDelete(amount, true);
            deletedMessages = messages.size;
          } else {
            let remaining = amount;
            while (remaining > 0) {
              const deleteCount = Math.min(remaining, 100);
              const messages = await channel.bulkDelete(deleteCount, true);
              deletedMessages += messages.size;
              remaining -= messages.size;
              if (messages.size < deleteCount) break;
            }
          }

          if (deletedMessages > 0) {
            await int.reply({
              content: `Deleted ${deletedMessages} messages.`,
              ephemeral: true,
            });
          } else {
            await int.reply({
              content:
                "No messages were deleted. Ensure the messages are not older than 14 days.",
              ephemeral: true,
            });
          }
        } catch (error) {
          console.error(error);
          await int.reply({
            content: "An error occurred while trying to delete messages.",
            ephemeral: true,
          });
        }
      } else {
        await int.reply({
          content: "This command can only be used in text channels.",
          ephemeral: true,
        });
      }
    } else {
      await int.reply({
        content: "Please specify a valid number of messages to delete.",
        ephemeral: true,
      });
    }
  },
};

export default clearCmd;
