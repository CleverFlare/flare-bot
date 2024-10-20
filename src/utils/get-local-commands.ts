import { Collection } from "discord.js";
import { join } from "path";
import getAllFiles from "@/utils/get-all-files";

export default function () {
  const commands = new Collection();
  const commandsPath = join(__dirname, "..", "commands");
  const commandsCategories = getAllFiles(commandsPath, true);

  for (const commandsCategory of commandsCategories) {
    let commandFiles = getAllFiles(commandsCategory);

    commandFiles = commandFiles.filter(
      (commandFile) =>
        commandFile.endsWith(".command.ts") ||
        commandFile.endsWith(".command.js"),
    );

    for (const commandFile of commandFiles) {
      const commandObject = require(commandFile).default;
      if ("data" in commandObject && "execute" in commandObject)
        commands.set(commandObject.data.name, commandObject);
      else
        console.log(
          `[WARNING] The command at ${commandFile} is missing required "data" or "execute" properties`,
        );
    }
  }

  return commands;
}
