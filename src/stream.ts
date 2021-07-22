/*
 * @deprecated For stream functions, please switch to https://www.npmjs.com/package/tranquil-stream
 */
export async function jsonStreamToObject(
  stream: NodeJS.ReadWriteStream
): Promise<Record<string, any>> {
  return new Promise((resolve, reject) => {
    let response = '';
    stream.on('data', data => (response += data)); // eslint-disable-line no-return-assign
    stream.on('error', err => reject(err));
    stream.on('end', () => {
      try {
        resolve(JSON.parse(response));
      } catch (e) {
        reject(
          new Error(
            'Stream did not resolve to a JSON object, you may need to process it another way.'
          )
        );
      }
    });
  });
}
