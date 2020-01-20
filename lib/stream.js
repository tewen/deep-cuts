async function streamToObject(stream) {
  return new Promise((resolve, reject) => {
    let response = '';
    stream.on('data', (data) => response += data); // eslint-disable-line no-return-assign
    stream.on('error', (err) => reject(err));
    stream.on('end', () => {
      try {
        resolve(JSON.parse(response));
      } catch (e) {
        reject(new Error('Stream did not resolve to a JSON object, you may need to process it another way.'));
      }
    });
  });
}

module.exports = {
  streamToObject
};
