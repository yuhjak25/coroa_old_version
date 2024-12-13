import {
  ButtonInteraction,
  CommandInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from "discord.js";
import SettingModel from "../database/models/SettingModel";

export async function getPreferredColor(
  int:
    | CommandInteraction
    | ModalSubmitInteraction
    | StringSelectMenuInteraction
    | ButtonInteraction
): Promise<string> {
  const guild = int.guild;

  const settings = await SettingModel.findOne({
    guild_id: guild?.id,
  });

  return settings?.settings?.color || "#c2ff0b";
}
