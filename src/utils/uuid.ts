import { v4 } from "uuid";

/**
 *
 *
 * @export
 * @param {boolean} [withDash=false]
 * @returns
 */
export function generateUUID(withDash: boolean = false) {
  if (withDash) return v4();
  return v4().replace(/-/g, "");
}
