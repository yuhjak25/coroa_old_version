import {
  ButtonInteraction,
  CommandInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from "discord.js";

const cooldowns: Map<string, number> = new Map();
export function cooldown(
  int:
    | CommandInteraction
    | ButtonInteraction
    | StringSelectMenuInteraction
    | ModalSubmitInteraction,
  cooldownTime: number
): boolean {
  const key = `${int.user.id}`;

  if (cooldowns.has(key)) {
    const expirationTime = cooldowns.get(key)!;
    if (Date.now() < expirationTime) {
      const remainingTime = (expirationTime - Date.now()) / 1000;

      int.reply({
        content: `> \`⏱️\` Por favor espera ${remainingTime.toFixed(
          1
        )} segundos para volver a usar el comando.`,
        ephemeral: true,
      });

      return true;
    }
  }

  cooldowns.set(key, Date.now() + cooldownTime * 1000);
  return false;
}
