import {
  ButtonInteraction,
  ApplicationCommandOptionType as CommandType,
  Events,
  Interaction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from "discord.js";
import CoroaClient from "../../app";
import { error } from "console";

export default {
  name: Events.InteractionCreate,
  run: async (client: CoroaClient, int: Interaction) => {
    if (int.isCommand()) {
      const command = client.slashCommands.get(int.commandName);
      const args: string[] = [];
      if (!command)
        return int.reply({
          content: "> `⚠️` Hubo un error al ejecutar este comando.",
          ephemeral: true,
        });
      for (const option of int.options.data) {
        if (option.type === CommandType.Subcommand) {
          if (option.name) args.push(option.name);
          option.options?.forEach((x) => {
            if (x.value) args.push(x.value as string);
          });
        } else if (option.value) args.push(option.value as string);
      }

      command.run(client, int, args);
    }

    if (int.isButton()) {
      const button = client.buttons.get(int.customId);
      if (!button)
        return int.reply({
          content: "> `⚠️` Hubo un error al ejecutar este botón.",
          ephemeral: true,
        });
      await button.run(client, int as ButtonInteraction);
    }

    if (int.isModalSubmit()) {
      const modal = client.modals.get(int.customId);
      if (!modal)
        return int.reply({
          content: "> `⚠️` Hubo un error al ejecutar este modal.",
          ephemeral: true,
        });
      await modal.run(client, int as ModalSubmitInteraction);
    }

    if (int.isAnySelectMenu()) {
      const selectMenu = client.selectMenus.get(int.customId);
      if (!selectMenu)
        return int.reply({
          content: "> `⚠️` Hubo un error al ejecutar este menú de selección.",
          ephemeral: true,
        });
      await selectMenu.run(client, int as StringSelectMenuInteraction);
    }
  },
};
