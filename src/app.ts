import {
  Client,
  Collection,
  GatewayIntentBits as Intents,
  Partials,
} from "discord.js";
import {
  ButtonData,
  EventData,
  ModalData,
  SelectMenuData,
  SlashCommandData,
} from "./config/types/types";
import {
  registerButtons,
  registerDiscApi,
  registerEvents,
  registerModals,
  registerSelectMenus,
  registerSlashCommands,
} from "./config/register";
import inits from "./inits";
import appConfig from "./config/interfaces/Config";
import Models from "./config/database/models/index";

export default class CoroaClient extends Client {
  slashCommands: Collection<string, SlashCommandData> = new Collection();
  events: Collection<string, EventData> = new Collection();
  buttons: Collection<string, ButtonData> = new Collection();
  modals: Collection<string, ModalData> = new Collection();
  selectMenus: Collection<string, SelectMenuData> = new Collection();
  config = appConfig;
  db = Models;

  constructor() {
    super({
      intents: [
        Intents.Guilds,
        Intents.GuildMembers,
        Intents.GuildMessages,
        Intents.GuildMessageTyping,
        Intents.GuildMessageReactions,
        Intents.GuildPresences,
        Intents.GuildIntegrations,
        Intents.GuildWebhooks,
        Intents.GuildVoiceStates,
        Intents.GuildInvites,
        Intents.DirectMessages,
        Intents.DirectMessageReactions,
        Intents.MessageContent,
      ],
      partials: [
        Partials.User,
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
      ],
    });
  }
  async run(): Promise<void> {
    if (!inits.APP_TOKEN!) console.log("Tienes que añadir el token!");
    await this.login(inits.APP_TOKEN!);
    console.log("\n\n\n\n\n\n\n\n🔄 Iniciando\n\n\n\n\n\n\n\n");
    await registerSlashCommands(this);
    await registerEvents(this);
    await registerButtons(this);
    await registerModals(this);
    await registerSelectMenus(this);
    await registerDiscApi(this);
  }
}

const client = new CoroaClient();
client.run();

process.on("uncaughtException", async (error: Error) => console.log(error));
process.on("unhandledRejection", async (error: Error) => console.log(error));
