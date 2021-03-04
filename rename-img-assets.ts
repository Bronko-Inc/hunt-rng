const fs = require('fs');
const path = require('path');

const itemPath = './src/data/img';

const run = async () => {
  const dirs = (await fs.promises.readdir(itemPath)) as string[];
  for (const dir of dirs) {
    const imgs = (await fs.promises.readdir(
      path.join(itemPath, dir)
    )) as string[];
    for (const img of imgs) {
      const oldName = path.join(itemPath, dir, img);
      const newName = path.join(
        itemPath,
        dir,
        `${img
          .substr(0, img.length - 4)
          .replace(/[\s\W]/g, '_')}.png`.toLowerCase()
      );
      await fs.promises.rename(oldName, newName);
    }
  }
};

run();
