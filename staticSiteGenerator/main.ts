import yargs from "yargs";
import chalk from "chalk";
import { hideBin } from "yargs/helpers";

import { build } from "./generator.js";
import { watch } from "./watch.js";

import packageJson from "../package.json" with { type: "json" };

/**
 * Main Entry, using YARGS to call different jobs.
 */
const main = () => {
  console.log(chalk.white("Welcome to the static site generator."));
  console.log(chalk.green(`Version ${packageJson.version}`));
  console.log();
  console.log(chalk.green("Use --help if you are stuck."));
  console.log(
    chalk.green("Main modes are `watch debug` and `build production`"),
  );
  console.log();

  yargs(hideBin(process.argv))
    .usage("generator watch")
    .version(packageJson.version)
    .command(
      "build [mode]",
      "Build the Static Site (mode: debug (default), production).",
      (yargs) => {
        return yargs.positional("mode", {
          describe: "Wether to generate production or debug code.",
          default: "debug",
          choices: ["debug", "production"],
        });
      },
      async (arg) => {
        console.log(chalk.green(`Starting to Build in ${arg.mode} mode`));

        // Apparently YARGS typing fails for choices, and defaults back to type
        // string;
        await build(arg.mode as "debug" | "production");
      },
    )
    .command(
      "watch [mode]",
      "Build and Serve the site and watch for changes (mode: debug (default), production).",
      (yargs) => {
        return yargs.positional("mode", {
          describe: "Wether to generate production or debug code.",
          default: "debug",
          choices: ["debug", "production"],
        });
      },
      async (arg) => {
        console.log(chalk.green(`Starting to Build in ${arg.mode} mode`));

        // Apparently YARGS typing fails for choices, and defaults back to type
        // string;
        await build(arg.mode as "debug" | "production");
        await watch(arg.mode as "debug" | "production");
      },
    )
    .help()
    .parse();
};

main();
