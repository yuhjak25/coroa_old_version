import { REST, Routes } from "discord.js";
import { RegisterTypes } from "./types/RegisterTypes";
import { readdirSync } from "fs";
import inits from "../inits";
import CoroaClient from "../app";

export function registerDiscApi(client: CoroaClient) {
  new REST({ version: "10" })
    .setToken(inits.APP_TOKEN!)
    .put(Routes.applicationCommands(inits.APP_ID!), {
      body: client.slashCommands,
    })
    .then(() => console.log("✅ Cargados los comandos (/) correctamente."));
}

export async function registerSlashCommands(client: CoroaClient) {
  const fileCommands: RegisterTypes = { all: 0, included: [], excluded: [] };
  const promises = readdirSync(`${__dirname}/../app/commands/`).map(
    async (dir) => {
      const commands = readdirSync(
        `${__dirname}/../app/commands/${dir}/`
      ).filter((file: string) => file.endsWith(".ts") || file.endsWith(".js"));
      fileCommands.all += commands.length;
      for (const file of commands) {
        const folder = (
          await import(`${__dirname}/../app/commands/${dir}/${file}`)
        ).default;
        if (!folder.name)
          fileCommands.excluded.push(file.split("/").pop()?.split(".")[0]!);
        client.slashCommands.set(folder.name, folder);
        fileCommands.included.push(folder.name);
      }
    }
  );
  await Promise.all(promises);
  console.log(
    `[Slash Commands] ${fileCommands.included.length} / ${fileCommands.all}`
  );

  if (fileCommands.included.length !== fileCommands.all)
    console.log(
      `[Slash Commands] Error en el archivo: ${fileCommands.excluded}.ts`
    );
}

export async function registerEvents(client: CoroaClient) {
  const fileEvents: RegisterTypes = { all: 0, included: [], excluded: [] };

  const commands = readdirSync(`${__dirname}/../app/events`).filter(
    (file) => file.endsWith(".ts") || file.endsWith(".js")
  );
  fileEvents.all = commands.length;
  for (const file of commands) {
    const folder = (await import(`${__dirname}/../app/events/${file}`)).default;
    if (!folder.name)
      fileEvents.excluded.push(file.split("/").pop()?.split(".")[0] as string);
    client.events.set(folder.name, folder);
    fileEvents.included.push(folder.name);
    if (folder?.rest)
      client.rest.on(folder.name, folder.run.bind(null, client));
    else client.on(folder.name, folder.run.bind(null, client));
  }
  console.log(`[Eventos]: ${fileEvents.included.length} / ${fileEvents.all}`);
  if (fileEvents.included.length !== fileEvents.all)
    console.log(`Error en ${fileEvents.excluded}`);
}

export async function registerButtons(client: CoroaClient) {
  const fileButtons: RegisterTypes = { all: 0, included: [], excluded: [] };
  const promises = readdirSync(`${__dirname}/../app/int/buttons/`).map(
    async (dir) => {
      const buttons = readdirSync(
        `${__dirname}/../app/int/buttons/${dir}`
      ).filter((file: string) => file.endsWith(".ts") || file.endsWith(".js"));
      fileButtons.all += buttons.length;
      for (const file of buttons) {
        const folder = (
          await import(`${__dirname}/../app/int/buttons/${dir}/${file}`)
        ).default;
        if (!folder.customId)
          fileButtons.excluded.push(file.split("/").pop()?.split(".")[0]!);
        client.buttons.set(folder.customId, folder);
        fileButtons.included.push(folder.customId);
      }
    }
  );
  await Promise.all(promises);
  console.log(`[Buttons] ${fileButtons.included.length} / ${fileButtons.all}`);
  if (fileButtons.included.length !== fileButtons.all)
    console.error(`[Buttons] Error en el archivo: ${fileButtons.excluded}.ts`);
}

export async function registerModals(client: CoroaClient) {
  const fileModals: RegisterTypes = { all: 0, included: [], excluded: [] };
  const promises = readdirSync(`${__dirname}/../app/int/modals/`).map(
    async (dir) => {
      const modals = readdirSync(
        `${__dirname}/../app/int/modals/${dir}`
      ).filter((file: string) => file.endsWith(".ts") || file.endsWith(".js"));
      fileModals.all += modals.length;
      for (const file of modals) {
        const folder = (
          await import(`${__dirname}/../app/int/modals/${dir}/${file}`)
        ).default;
        if (!folder.customId)
          fileModals.excluded.push(file.split("/").pop()?.split(".")[0]!);
        client.modals.set(folder.customId, folder);
        fileModals.included.push(folder.customId);
      }
    }
  );
  await Promise.all(promises);
  console.log(`[Modals] ${fileModals.included.length} / ${fileModals.all}`);
  if (fileModals.included.length !== fileModals.all)
    console.error(`[Modals] Error en el archivo: ${fileModals.excluded}.ts`);
}

export async function registerSelectMenus(client: CoroaClient) {
  const fileSelectMenus: RegisterTypes = { all: 0, included: [], excluded: [] };
  const promises = readdirSync(`${__dirname}/../app/int/selectMenus/`).map(
    async (dir) => {
      const selectMenus = readdirSync(
        `${__dirname}/../app/int/selectMenus/${dir}`
      ).filter((file: string) => file.endsWith(".ts") || file.endsWith(".js"));
      fileSelectMenus.all += selectMenus.length;
      for (const file of selectMenus) {
        const folder = (
          await import(`${__dirname}/../app/int/selectMenus/${dir}/${file}`)
        ).default;
        if (!folder.customId)
          fileSelectMenus.excluded.push(file.split("/").pop()?.split(".")[0]!);
        client.selectMenus.set(folder.customId, folder);
        fileSelectMenus.included.push(folder.customId);
      }
    }
  );
  await Promise.all(promises);
  console.log(
    `[Select-Menus] ${fileSelectMenus.included.length} / ${fileSelectMenus.all}`
  );
  if (fileSelectMenus.included.length !== fileSelectMenus.all)
    console.error(
      `[Select-Menus] Error en el archivo: ${fileSelectMenus.excluded}.ts`
    );
}
