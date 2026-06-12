/** Strip Mongoose metadata / circular refs for RSC → client props. */
export function toPlain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
