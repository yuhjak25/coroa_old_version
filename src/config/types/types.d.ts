import {
  ApplicationCommandOptionType,
  ButtonInteraction,
  CommandInteraction,
  ModalSubmitInteraction,
  PermissionResolvable,
  StringSelectMenuInteraction,
} from "discord.js";

export type SlashCommandData = {
  name: string;
  description: string;
  category: Category;
  dev?: boolean;
  dm?: boolean;
  memberPermissions?: PermissionResolvable[];
  options?: SlashCommandOption[];
  run: (
    client: CoroaClient,
    int: CommandInteraction,
    args: string[]
  ) => Promise<void>;
};

export interface SlashCommandOption {
  name: string;
  description: string;
  type: ApplicationCommandOptionType;
  required?: boolean;
  choices?: SlashCommandOptionChoice[];
}

export interface SlashCommandOptionChoice {
  name: string;
  value: string | number | boolean;
}

export interface EventData {
  name: string;
  run: (client: CoroaClient, ...args: any[]) => Promise<void>;
}

export type ButtonData = {
  customId: string;
  memberPermissions?: PermissionResolvable[];
  run: (client: CoroaClient, int: ButtonInteraction) => Promise<void>;
};

export type ModalData = {
  customId: string;
  run: (client: CoroaClient, int: ModalSubmitInteraction) => Promise<void>;
};

export type SelectMenuData = {
  customId: string;
  memberPermissions?: PermissionResolvable[];
  run: (client: CoroaClient, int: StringSelectMenuInteraction) => Promise<void>;
};
