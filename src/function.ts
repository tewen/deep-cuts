const isFunction = (val: any): boolean => typeof val === 'function';

export const acceptNoArguments = (
  fn: Function,
  ...args: any[]
): Function => () => fn(...args);

export function functionOrValue(fnOrValue: any, ...args: any[]): unknown {
  return isFunction(fnOrValue)
    ? functionOrValue(fnOrValue(...args), ...args)
    : fnOrValue;
}

export async function tryCatch(
  tryFn: Function,
  catchFn?: Function
): Promise<{ response?: unknown; error?: unknown }> {
  try {
    return { response: await tryFn() };
  } catch (e) {
    return { error: catchFn && isFunction(catchFn) ? await catchFn(e) : e };
  }
}
