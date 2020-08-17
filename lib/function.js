const isFunction = (val) => typeof val === 'function';

const acceptNoArguments = (fn, ...args) => () => fn(...args);

function functionOrValue(fnOrValue, ...args) {
  return isFunction(fnOrValue) ? functionOrValue(fnOrValue(...args), ...args) : fnOrValue;
}

async function tryCatch(tryFn, catchFn) {
  try {
    return { response: await tryFn() };
  } catch (e) {
    return { error: isFunction(catchFn) ? await catchFn(e) : e };
  }
}

module.exports = {
  acceptNoArguments,
  functionOrValue,
  tryCatch
};
