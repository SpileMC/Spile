import { join } from "path";

import RoughPackageJson from "@_types/common/RoughPackageJson";

import { readFile } from "fs-nextra";
import jsonParse from "secure-json-parse";
import { argv } from "yargs";

// This is a replica of Java's Object.hashCode() method.
export function createJavaHash(strToHash: string): number {
  let hash = 0;
  let char: number;

  for (const charStr of strToHash) {
    char = charStr.charCodeAt(0);
    hash = hash * 31 + char;

    // Convert to 32bit integer.
    hash |= 0;
  }

  return hash;
}

export async function dependencyPresent(dependencyName: string): Promise<boolean> {
  try {
    await import(dependencyName);

    return true;
  } catch {
    return false;
  }
}

export async function getPackageJson() {
  const packageJsonLoc = join(__dirname, "..", "..", "..", "package.json");
  const contents = await readFile(packageJsonLoc, { encoding: "utf-8" });

  return jsonParse(contents) as RoughPackageJson;
}

export function checkEnvBool(envVar?: string): boolean {
  return !!envVar && envVar === "yes"
    || envVar === "true"
    || envVar === "1"
    || envVar === "y";
}

export const isDebug = checkEnvBool(process.env.S_DEBUG)
  || !!argv.debug
  || !!argv.develop;

// @link https://github.com/skyra-project/skyra/blob/ac8d0f42270cb45fd1f2e9869fd3d7176c021d8e/src/lib/util/util.ts#L596
// @license MIT - Copyright Skyra Developers.
export function Enumerable(value: boolean) {
  return (target: unknown, key: string) => {
    Object.defineProperty(target, key, {
      enumerable: value,
      set(this: unknown, val: unknown) {
        Object.defineProperty(this, key, {
          configurable: true,
          enumerable: value,
          value: val,
          writable: true,
        });
      },
    });
  };
}

export default createJavaHash;
