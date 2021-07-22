export async function tailRecursion<T>(
  collection: T[],
  operation: (item: T) => any,
  payload: any[] = []
): Promise<any[]> {
  if (collection?.length) {
    const first: T = collection[0];
    if (first) {
      const response: any = await operation(first);
      return tailRecursion(
        collection.slice(1),
        operation,
        payload.concat(response)
      );
    }
  }
  return payload;
}
