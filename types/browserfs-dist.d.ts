declare module "browserfs/dist/node/core/api_error" {
  export type ApiError = {
    code?: string;
    message?: string;
    path?: string;
  };
}

declare module "browserfs/dist/node/core/file_system" {
  export type BFSCallback<T> = (error?: unknown, result?: T) => void;
  export interface FileSystem {
    [key: string]: unknown;
  }
}

declare module "browserfs/dist/node/core/FS" {
  export interface FSModule {
    [key: string]: unknown;
    exists(path: string, cb?: (exists: boolean) => void): void;
    lstat(path: string, cb?: (error?: any, stats?: any) => void): void;
    mkdir(
      path: string,
      opts?: { flag: string },
      cb?: (error?: any) => void
    ): void;
    readFile(
      path: string,
      cb?: (error?: any, data: Buffer) => void
    ): void;
    readdir(
      path: string,
      cb?: (error?: any, data?: string[]) => void
    ): void;
    rename(
      oldPath: string,
      newPath: string,
      cb?: (error?: any) => void
    ): void;
    rmdir(path: string, cb?: (error?: any) => void): void;
    stat(path: string, cb?: (error?: any, stats?: any) => void): void;
    unlink(path: string, cb?: (error?: any) => void): void;
    writeFile(
      path: string,
      data: Buffer | string,
      optsOrCb?: { flag: string } | ((error?: any) => void),
      cb?: (error?: any) => void
    ): void;
    getRootFS(): unknown;
  }
}

declare module "browserfs/dist/node/core/node_fs_stats" {
  export default interface Stats {
    atime: Date;
    atimeMs: number;
    birthtime: Date;
    birthtimeMs: number;
    blksize: number;
    blocks: number;
    ctime: Date;
    ctimeMs: number;
    mode: number;
    mtime: Date;
    mtimeMs: number;
    size: number;
    isDirectory: () => boolean;
    isFile: () => boolean;
    isSymbolicLink: () => boolean;
    isSocket: () => boolean;
    isBlockDevice: () => boolean;
    isCharacterDevice: () => boolean;
    isFIFO: () => boolean;
  }
}

declare module "browserfs/dist/node/backend/Emscripten" {
  export default interface EmscriptenFileSystem {
    _FS?: unknown;
  }
}

declare module "browserfs/dist/node/backend/MountableFileSystem" {
  export default interface MountableFileSystem {
    mntMap: Record<string, any>;
    mountList: string[];
    mount?: (path: string, fs: unknown) => void;
    umount?: (path: string) => void;
    _getFs: (path: string) => { fs?: unknown };
  }
}

declare module "browserfs/dist/node/backend/OverlayFS" {
  export default interface OverlayFS {
    getOverlayedFileSystems: () => {
      readable?: { empty?: () => void };
      writable?: {
        _cache?: Record<string, string>;
        _sync?: () => void;
        empty?: (cb: (error?: unknown) => void) => void;
        getName?: () => string;
      };
    };
  }
}

declare module "browserfs/dist/node/backend/IndexedDB" {
  export default interface IndexedDBFileSystem {
    _cache?: Record<string, string>;
    _sync?: () => void;
    empty: (cb: (error?: unknown) => void) => void;
    getName: () => string;
  }
}

declare module "browserfs/dist/node/backend/InMemory" {
  export default interface InMemoryFileSystem {
    empty: (cb: (error?: unknown) => void) => void;
    getName: () => string;
  }
}

declare module "browserfs/dist/node/backend/HTTPRequest" {
  export default interface HTTPRequest {
    empty: () => void;
  }
}

declare module "browserfs/dist/node/backend/ZipFS" {
  import type { FileSystem } from "browserfs/dist/node/core/file_system";

  export default interface ZipFS extends FileSystem {}
}

declare module "browserfs/dist/node/backend/IsoFS" {
  import type { FileSystem } from "browserfs/dist/node/core/file_system";

  export default interface IsoFS extends FileSystem {}
}
