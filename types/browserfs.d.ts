declare module "browserfs" {
  export type FileSystemConfiguration = Record<string, unknown>;

  export const FileSystem: any;

  export function BFSRequire(module: "fs"): import("browserfs/dist/node/core/FS").FSModule;
  export function BFSRequire(module: string): any;

  export function configure(
    config: FileSystemConfiguration,
    cb: (error?: unknown) => void
  ): void;
}
