export async function tailRecursion<T>(
  collection: T[],
  operation: (item: T) => any,
  payload: any[] = []
): Promise<any[]> {
  if (collection?.length) {
    for (const item of collection) {
      const response: any = await operation(item);
      payload.push(response);
    }
  }
  return payload;
}
