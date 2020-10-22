import gulp from "gulp";
import { generateRoutesAndSpec } from "./tsoa";

export function watchTsoa() {
  return gulp.watch(
    ["src/controllers/**/*.ts", "src/models/**/*.ts", "src/**/*.schema.ts"],
    { queue: false, ignoreInitial: false },
    generateRoutesAndSpec
  );
}

export async function generateTsoa() {
  await generateRoutesAndSpec();
}
