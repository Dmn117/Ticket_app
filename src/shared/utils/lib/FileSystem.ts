import fs from 'fs';
import path from 'path';


export const createFolder = (folder: string) => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
};

export const deleteFilesWithSameBaseName = async (dirname: string, filename: string): Promise<void> => {
    const baseName: string = path.basename(filename, path.extname(filename));
    const files = await fs.promises.readdir(dirname);
    const filesToDelete = files.filter((file) => {
        return path.basename(file, path.extname(file)) === baseName;
    });

    for (const file of filesToDelete) {
        const filePath = path.join(dirname, file);
        await fs.promises.unlink(filePath);
    }
};