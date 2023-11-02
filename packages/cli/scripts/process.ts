import * as fs from "fs";
import * as path from "path";

import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface WordReplacement {
  oldWord: string | RegExp;
  newWord: string;
}

function replaceWordsInFile(
  filePath: string,
  outputFilePath: string,
  replacements: WordReplacement[]
) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  let updatedContent = fileContent;

  replacements.forEach(({ oldWord, newWord }) => {
    updatedContent = updatedContent.replace(new RegExp(oldWord, "g"), newWord);
  });

  fs.writeFileSync(outputFilePath, updatedContent);
}

function processDirectory(
  packageSampleDirPath: string,
  packageTemplateDirPath: string,
  replacements: WordReplacement[],
  excludedDirectories: string[]
) {
  fs.readdirSync(packageSampleDirPath).forEach((file) => {
    const inputFilePath = path.join(packageSampleDirPath, file);
    const outputFilePath = path
      .join(packageTemplateDirPath, file)
      .concat(".hbs");

    if (fs.statSync(inputFilePath).isDirectory()) {
      if (excludedDirectories.includes(file)) {
        // Skip excluded directory
        return;
      }
      const subDirectory = path.join(packageTemplateDirPath, file);
      fs.mkdirSync(subDirectory, { recursive: true });
      processDirectory(
        inputFilePath,
        subDirectory,
        replacements,
        excludedDirectories
      );
    } else {
      replaceWordsInFile(inputFilePath, outputFilePath, replacements);
    }
  });
}

const examplesDirPath = path.resolve(__dirname, "../examples");
const templatesDirPath = path.resolve(__dirname, "../templates");
const excludedDirectories = [".turbo", "node_modules", ".wrangler"];

try {
  const directories = fs
    .readdirSync(examplesDirPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  // create the templates directory
  fs.mkdirSync(templatesDirPath, { recursive: true });

  directories.forEach((packageName) => {
    const packageExampleDirPath = examplesDirPath.concat(`/${packageName}`);
    const packageTemplateDirPath = templatesDirPath.concat(`/${packageName}`);

    fs.mkdirSync(packageTemplateDirPath, { recursive: true });

    const wordReplacements: WordReplacement[] = [
      {
        oldWord: `${packageName}-project-description`,
        newWord: "{{projectDescription}}",
      },
      { oldWord: `${packageName}-project-name`, newWord: `{{projectName}}` },
      { oldWord: packageName, newWord: `{{projectName}}` },
      { oldWord: /workspace:\*/, newWord: "latest" },
      // Add more replacements as needed
    ];

    processDirectory(
      packageExampleDirPath,
      packageTemplateDirPath,
      wordReplacements,
      excludedDirectories
    );

    console.log(`Complete processing template: ${packageName}`);
  });
} catch (error) {
  throw new Error(error as string);
}
