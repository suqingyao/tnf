import * as p from '@umijs/clack-prompts';
import fs from 'fs';
import { instagram } from 'gradient-string';
import path from 'path';
import yargsParser from 'yargs-parser';
import { create } from './create';

async function run(cwd: string) {
  const argv = yargsParser(process.argv.slice(2), {
    alias: {
      version: ['v'],
      help: ['h'],
      template: ['t'],
    },
    boolean: ['version', 'help'],
  });

  console.log(
    instagram(`
 ████████╗███╗   ██╗███████╗
    ██╔══╝████╗  ██║██╔════╝
    ██║   ██╔██╗ ██║█████╗
    ██║   ██║╚██╗██║██╔══╝
    ██║   ██║ ╚████║██║
    ╚═╝   ╚═╝  ╚═══╝╚═╝
  `),
  );

  // Check if the version flag is set
  if (argv.version) {
    const pkgPath = path.join(__dirname, '../package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    console.log(`${pkg.name}@${pkg.version}`);
    return;
  }

  // Check if the help flag is set
  if (argv.help) {
    console.log(`Usage: create-tnf [project-name] [options]

Options:
  --version, -v     Show version number
  --help, -h        Show help
  --template, -t    Specify a template for the project
  --npm-client, -n  Specify the npm client to use (pnpm, yarn, npm)

Examples:
  create-tnf                          Create a new project
  create-tnf myapp                    Create a new project named 'myapp'
  create-tnf myapp --template=minimal Create a new project named 'myapp' using the 'minimal' template`);
    return;
  }

  p.intro('Creating a new TNF project...');
  create({
    cwd: cwd,
    name: argv._[0] as string | undefined,
    template: argv.template,
    packageManager: argv.packageManager,
  })
    .then(() => {
      p.outro('Create success!');
    })
    .catch((err) => {
      p.cancel(`Create failed, ${err.message}`);
      process.exit(1);
    });
}

run(process.cwd()).catch((err) => {
  console.error(err);
  process.exit(1);
});
