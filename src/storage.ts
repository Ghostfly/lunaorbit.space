import { GetFileOptions, GetFileUrlOptions, PutFileOptions, Storage } from '@stacks/storage';
import { userSession } from './auth';

export const storage = new Storage({ userSession });
export const blockStackUsername = '1CvACptXN5K9nJbTQHpWf5sA4MXGEQv3h9';

export async function putFile(name: string, data: string | Buffer | ArrayBufferView | Blob, options: PutFileOptions): Promise<string> {
  const file = await storage.putFile(name, data, options);

  return file;
}

export async function getFile(name: string, options: GetFileOptions): Promise<string | ArrayBuffer | null> {
  const file = await storage.getFile(name, options);

  return file;
}

export async function getFileURL(name: string, options: GetFileUrlOptions): Promise<string> {
  const file = await storage.getFileUrl(name, options);

  return file;
}

export async function getFileContents(path: string, app: string, username: string | undefined, zoneFileLookupURL: string | undefined, forceText: boolean): Promise<string | ArrayBuffer | null> {
  const fileContents = await storage.getFileContents(path, app, username, zoneFileLookupURL, forceText);

  return fileContents;
}

export async function deleteFile(name: string, options?: {
  wasSigned: boolean | undefined;
}): Promise<boolean> {
  await storage.deleteFile(name, options);

  return true;
}

export async function listFiles(name?: string): Promise<string | string[] | ArrayBuffer | null> {
  const files: string[] = [];

  storage.listFiles((filename) => {
    if (name && name === filename) {
      return true;
    }

    files.push(filename);

    return false;
  });

  if (name) {
    return await storage.getFile(name);
  }

  return files;
}