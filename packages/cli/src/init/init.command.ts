import { Command } from "commander";
import { input, select } from "@inquirer/prompts";
import { resolve, dirname, join } from "path";
import fs from "fs-extra";

import { fileURLToPath } from "url";
import type { InitOptions } from "./init.options.js";
import {
  initOptionProjectDescription,
  initOptionProjectLocation,
  initOptionProjectName,
} from "./init.options.js";
import { glob } from "glob";
import handlebars from "handlebars";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const commandInit = new Command("init").description(
  "Bootstrap a new FlareCity API project."
);

async function init(params: InitOptions) {
  const projectName =
    params?.name ||
    (await input({
      message: "What do you want to name your project?",
      default: "app-city",
    }));
  const projectDescription =
    params?.description ||
    (await input({
      message: "Please describe your project",
      default: "A serverless Cloudflare Workers API powered by FlareCity.",
    }));
  const projectLocation = !params?.location
    ? await input({
        message: "Where do you want to create your project?",
        default: resolve(process.cwd(), `./${projectName}`),
      })
    : join(process.cwd(), params.location, projectName);

  const templatesDirPath = resolve(__dirname, "../../templates");

  const directories = fs
    .readdirSync(templatesDirPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const template = await select({
    message: "Please select a template",
    choices: directories.map((dir) => ({
      name: dir,
      value: dir,
    })),
  });

  const templateDirGlob = resolve(templatesDirPath, `./${template}/**/*.*`);
  const templateDirDotGlob = resolve(templatesDirPath, `./${template}/**/.*`);

  // 2. Process TS files
  const filesToProcess = glob.sync([templateDirGlob, templateDirDotGlob]);

  console.log("Instantiating template...");
  filesToProcess.forEach((sourcePath) => {
    const filePath = sourcePath.split(template)[1]; // Extract relative file path from the source path
    const outputPath = `${projectLocation}${filePath}`;

    const existingContent = fs.readFileSync(sourcePath, "utf-8");

    // Compile the Handlebars template if it exists
    const compiledTemplate = handlebars.compile(existingContent);

    // Replace placeholders with actual values
    const replacedContent = compiledTemplate({
      projectName,
      projectDescription,
    });

    // Write the new file
    const outputPathSansHbs = outputPath.split(".hbs")[0];
    fs.ensureFileSync(outputPathSansHbs);
    fs.writeFileSync(outputPathSansHbs, replacedContent);
  });

  console.log("Instantiating template... done.");
  console.log(
    filesToProcess.length.toString().concat(" files successfully processed.")
  );
  console.log(`
${projectName} successfully bootstrapped!

Location: ${projectLocation}

Change into the directory and run \`yarn install && yarn dev\``);
}

commandInit
  .addOption(initOptionProjectName)
  .addOption(initOptionProjectDescription)
  .addOption(initOptionProjectLocation)
  .action(init);
