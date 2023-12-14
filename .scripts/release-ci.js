import { execa } from 'execa';
import fs from 'fs';
import minimist from 'minimist';
import path from 'path';
import { fileURLToPath } from 'url';
import kleur from 'kleur';

// @ts-ignore
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = minimist(process.argv.slice(2));

const packages = fs
  .readdirSync(path.resolve(__dirname, '../packages'))
  .filter((p) => !p.startsWith('.'));

function step(msg) {
  console.info('\n✨ ' + kleur.cyan(msg) + '\n');
}

async function run(bin, args, opts = {}) {
  return execa(bin, args, { stdio: 'inherit', ...opts });
}

function getPkgRoot(pkgName) {
  return path.resolve(__dirname, '../packages/' + pkgName);
}

function updatePackageVersion(pkgRoot, version) {
  const pkgPath = path.resolve(pkgRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkg.version = version;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

function updateVersions(version) {
  updatePackageVersion(path.resolve(__dirname, '..'), version);
  packages.forEach((p) => updatePackageVersion(getPkgRoot(p), version));
}

async function publishPackage(pkgName, version) {
  const pkgRoot = getPkgRoot(pkgName);

  step(`Publishing ${pkgName}...`);

  try {
    await run('pnpm', ['publish', '--publish-branch', 'standalone'], {
      cwd: pkgRoot,
      stdio: 'pipe',
    });
    console.log(kleur.green(`✅ Successfully published ${pkgName}@${version}`));
  } catch (e) {
    if (/** @type {any} */ (e).stderr.match(/previously published/)) {
      console.log(kleur.red(`🚫 Skipping already published: ${pkgName}`));
    } else {
      throw e;
    }
  }
}

async function main() {
  const targetVersion = args._[0];

  updateVersions(targetVersion);

  step('Updating lockfile...');
  await run(`pnpm`, ['install']);

  step('Generating changelog...');
  await run(`pnpm`, ['changelog']);

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' });
  if (stdout) {
    step('Committing changes...');

    await run('git', ['config', 'user.name', 'github-actions[bot]']);
    await run('git', [
      'config',
      'user.email',
      '41898282+github-actions[bot]@users.noreply.github.com',
    ]);
    await run('git', ['add', '-A']);
    await run('git', ['commit', '-m', `chore(release): v${targetVersion}`]);
  } else {
    console.log('No changes to commit.');
  }

  for (const pkg of packages) {
    await publishPackage(pkg, targetVersion);
  }

  step('Pushing to GitHub...');
  await run('git', ['tag', `v${targetVersion}`]);
  await run('git', ['push', 'origin', `refs/tags/v${targetVersion}`]);
  await run('git', ['push']);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
