function isDecimalOrInteger(value: any): boolean {
  return /^[-+]?[0-9]+(\.[0-9]+|)$/.test(String(value));
}

export function parseFloatOrUndefined(value: any): number | undefined {
  const parsed = parseFloat(value);
  return isDecimalOrInteger(value) && !isNaN(parsed) ? parsed : undefined;
}

export function parseIntegerOrUndefined(value: any): number | undefined {
  const parsed = parseInt(value, 10);
  return isDecimalOrInteger(value) && !isNaN(parsed) ? parsed : undefined;
}
