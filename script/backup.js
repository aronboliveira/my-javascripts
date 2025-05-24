#!/usr/bin/env node

const fs = require("fs").promises,
  path = require("path"),
  { existsSync, statSync } = require("fs"),
  CONFIG = {
    sourceDir: process.argv[2] || ".",
    backupPrefix: "Drive_Backup_",
    logLevel: "info",
  },
  logger = {
    debug: (msg) =>
      CONFIG.logLevel === "debug" && console.log(`[DEBUG] ${msg}`),
    info: (msg) =>
      ["debug", "info"].includes(CONFIG.logLevel) &&
      console.log(`[INFO] ${msg}`),
    warn: (msg) =>
      ["debug", "info", "warn"].includes(CONFIG.logLevel) &&
      console.warn(`[WARN] ${msg}`),
    error: (msg) => console.error(`[ERROR] ${msg}`),
  };

async function backupDrive() {
  try {
    const sourceDir = path.resolve(CONFIG.sourceDir),
      timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, ""),
      backupName = `${CONFIG.backupPrefix}${timestamp}`,
      backupPath = path.join(sourceDir, backupName);
    for (const i of [
      `Starting backup process...`,
      `Source directory: ${sourceDir}`,
      `Backup directory: ${backupPath}`,
      "Step 1: Cleaning up duplicates in source directory...",
    ])
      logger.info(i);
    await cleanupDuplicatesInRoot(sourceDir);
    if (!existsSync(backupPath)) {
      await fs.mkdir(backupPath, { recursive: true });
      logger.info(`Created backup directory: ${backupName}`);
    } else logger.info(`Using existing backup directory: ${backupName}`);
    logger.info("Step 3: Starting backup...");
    await copyDirectoryContents(sourceDir, backupPath);

    logger.info("Backup completed successfully!");
  } catch (error) {
    logger.error(`Backup failed: ${error.message}`);
    process.exit(1);
  }
}
async function cleanupDuplicatesInRoot(sourceDir) {
  try {
    const items = await fs.readdir(sourceDir, { withFileTypes: true }),
      fileNames = new Map(),
      duplicates = [];
    for (const item of items) {
      if (item.isFile()) {
        const fileName = item.name,
          fullPath = path.join(sourceDir, fileName);
        if (fileNames.has(fileName)) {
          duplicates.push(fullPath);
          logger.debug(`Found duplicate: ${fileName}`);
        } else fileNames.set(fileName, fullPath);
      }
    }
    logger.info(`Deleting ${duplicates.length} duplicate files...`);
    for (const duplicatePath of duplicates) {
      try {
        await fs.unlink(duplicatePath);
        logger.debug(`  Deleted duplicate: ${path.basename(duplicatePath)}`);
      } catch (error) {
        logger.warn(`  Failed to delete ${duplicatePath}: ${error.message}`);
      }
    }
    logger.info(`Cleanup complete: ${duplicates.length} duplicates removed`);
  } catch (error) {
    logger.error(`Failed to cleanup duplicates: ${error.message}`);
    throw error;
  }
}

async function copyDirectoryContents(sourceDir, targetDir) {
  try {
    logger.debug(
      `Processing directory: ${path.basename(sourceDir)} → ${path.basename(
        targetDir
      )}`
    );
    const items = await fs.readdir(sourceDir, { withFileTypes: true });
    for (const item of items) {
      if (item.isFile()) {
        const sourceFile = path.join(sourceDir, item.name),
          targetFile = path.join(targetDir, item.name);
        if (!existsSync(targetFile)) {
          try {
            await fs.copyFile(sourceFile, targetFile);
            logger.debug(`  Copied file: ${item.name}`);
          } catch (error) {
            logger.warn(`  Failed to copy file ${item.name}: ${error.message}`);
          }
        } else logger.debug(`  Skipping existing file: ${item.name}`);
      }
    }
    for (const item of items) {
      if (item.isDirectory()) {
        const folderName = item.name;
        if (folderName.startsWith(CONFIG.backupPrefix)) {
          logger.debug(`  Skipping backup directory: ${folderName}`);
          continue;
        }
        const sourceSubDir = path.join(sourceDir, folderName),
          targetSubDir = path.join(targetDir, folderName);
        if (!existsSync(targetSubDir)) {
          await fs.mkdir(targetSubDir, { recursive: true });
          logger.debug(`  Created directory: ${folderName}`);
        }
        if (existsSync(targetSubDir)) {
          const sourceFileCount = await getFileCount(sourceSubDir),
            targetFileCount = await getFileCount(targetSubDir);
          if (sourceFileCount === targetFileCount) {
            logger.info(
              `  Skipping directory (already complete): ${folderName} (${sourceFileCount} files)`
            );
            continue;
          } else
            logger.info(
              `  Processing directory (incomplete): ${folderName} (source: ${sourceFileCount}, target: ${targetFileCount})`
            );
        } else logger.info(`  Processing new directory: ${folderName}`);
        await copyDirectoryContents(sourceSubDir, targetSubDir);
      }
    }
  } catch (error) {
    logger.error(`Failed to copy directory contents: ${error.message}`);
    throw error;
  }
}

async function getFileCount(dirPath) {
  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    return items.filter((item) => item.isFile()).length;
  } catch (error) {
    logger.warn(`Failed to count files in ${dirPath}: ${error.message}`);
    return 0;
  }
}

async function getDirectoryStats(dirPath) {
  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true }),
      files = items.filter((item) => item.isFile()).length,
      folders = items.filter((item) => item.isDirectory()).length;
    return { files, folders };
  } catch (error) {
    logger.warn(`Failed to get stats for ${dirPath}: ${error.message}`);
    return { files: 0, folders: 0 };
  }
}

async function checkBackupStatus() {
  try {
    const sourceDir = path.resolve(CONFIG.sourceDir),
      timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, ""),
      backupName = `${CONFIG.backupPrefix}${timestamp}`,
      backupPath = path.join(sourceDir, backupName);
    logger.info(`Checking backup status for: ${backupName}`);
    if (existsSync(backupPath)) {
      const stats = await getDirectoryStats(backupPath),
        backupStat = statSync(backupPath);
      for (const i of [
        `✅ Today's backup exists:`,
        `   Path: ${backupPath}`,
        `   Created: ${backupStat.birthtime}`,
        `   Files: ${stats.files}, Folders: ${stats.folders}`,
      ])
        logger.info(i);
    } else {
      logger.info(`❌ No backup found for today: ${backupName}`);
    }
    const items = await fs.readdir(sourceDir, { withFileTypes: true }),
      backupDirs = items
        .filter(
          (item) =>
            item.isDirectory() && item.name.startsWith(CONFIG.backupPrefix)
        )
        .sort((a, b) => b.name.localeCompare(a.name));
    if (backupDirs.length > 0) {
      logger.info(`\n📁 All backup directories:`);
      for (const dir of backupDirs) {
        const dirPath = path.join(sourceDir, dir.name),
          stats = await getDirectoryStats(dirPath);
        logger.info(
          `   ${dir.name}: ${stats.files} files, ${stats.folders} folders`
        );
      }
    }
  } catch (error) {
    logger.error(`Failed to check backup status: ${error.message}`);
  }
}
async function cleanupOldBackups(keepCount = 7) {
  try {
    const sourceDir = path.resolve(CONFIG.sourceDir),
      items = await fs.readdir(sourceDir, { withFileTypes: true }),
      backupDirs = items
        .filter(
          (item) =>
            item.isDirectory() && item.name.startsWith(CONFIG.backupPrefix)
        )
        .map((item) => ({
          name: item.name,
          path: path.join(sourceDir, item.name),
          stat: statSync(path.join(sourceDir, item.name)),
        }))
        .sort(
          (a, b) => b.stat.birthtime.getTime() - a.stat.birthtime.getTime()
        );
    if (backupDirs.length <= keepCount) {
      logger.info(
        `Found ${backupDirs.length} backup directories, all will be kept`
      );
      return;
    }
    const toDelete = backupDirs.slice(keepCount);
    logger.info(`Deleting ${toDelete.length} old backup directories...`);
    for (const backup of toDelete) {
      try {
        await fs.rm(backup.path, { recursive: true, force: true });
        logger.info(`  Deleted: ${backup.name}`);
      } catch (error) {
        logger.warn(`  Failed to delete ${backup.name}: ${error.message}`);
      }
    }
    logger.info(
      `Cleanup complete. Kept ${Math.min(
        keepCount,
        backupDirs.length
      )} most recent backups.`
    );
  } catch (error) {
    logger.error(`Failed to cleanup old backups: ${error.message}`);
  }
}
async function main() {
  const command = process.argv[3] || "backup";
  switch (command) {
    case "backup":
      await backupDrive();
      break;
    case "status":
      await checkBackupStatus();
      break;
    case "cleanup":
      const keepCount = parseInt(process.argv[4]) || 7;
      await cleanupOldBackups(keepCount);
      break;
    case "help":
      console.log(`
Usage: node backup.js [source_directory] [command] [options]

Commands:
  backup          Create a backup (default)
  status          Check backup status
  cleanup [N]     Keep only the last N backups (default: 7)
  help            Show this help

Examples:
  node backup.js                    # Backup current directory
  node backup.js /home/user/docs    # Backup specific directory
  node backup.js . status           # Check backup status
  node backup.js . cleanup 5        # Keep only last 5 backups

Environment:
  LOG_LEVEL=debug|info|warn|error   # Set logging level (default: info)
      `);
      break;
    default:
      logger.error(`Unknown command: ${command}`);
      logger.info('Use "help" command for usage information');
      process.exit(1);
  }
}
if (process.env.LOG_LEVEL) CONFIG.logLevel = process.env.LOG_LEVEL;
if (require.main === module) {
  main().catch((error) => {
    logger.error(`Script failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  backupDrive,
  checkBackupStatus,
  cleanupOldBackups,
  cleanupDuplicatesInRoot,
};
