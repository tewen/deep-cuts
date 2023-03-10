import { isNil } from './object';

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

export function currencyToFloat(
  currency: string | number,
  sign: string = '$'
): number | undefined {
  return parseFloatOrUndefined(
    (String(currency) || '')
      .replace(new RegExp('^\\' + sign, 'ig'), '')
      .replace(/,/gi, '')
      .trim()
  );
}

export function roundToNearestFraction(
  value: string | number,
  denominator: number,
  maxDecimalPlaces: number
): number | undefined {
  const valueOrUndefined = parseFloatOrUndefined(value);
  if (!isNil(valueOrUndefined)) {
    return parseFloat(
      (
        Math.round((valueOrUndefined as number) * denominator) / denominator
      ).toFixed(maxDecimalPlaces)
    );
  }
  return undefined;
}
