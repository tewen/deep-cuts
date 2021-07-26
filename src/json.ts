import { isObject } from './object';

export function isJsonString(str: any): boolean {
  try {
    return isObject(JSON.parse(str));
  } catch (e) {
    return false;
  }
}

export function safeJsonParse(obj: any): object | null {
  if (obj && typeof obj === 'string') {
    try {
      return JSON.parse(obj);
    } catch (e) {
      // Do nothing here
    }
  }
  return null;
}
