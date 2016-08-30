const colors = {
  red: 91,
  green: 92,
  yellow: 93,
  white: 97,
};

const levels = {
  error: 'red',
  success: 'green',
  warning: 'yellow',
  info: 'white',
};

export const logger = (level, message) => {
  process.stdout.write(`\x1b[${colors[levels[level]]}m${message}\n\x1b[0m`);
};

// FIXME: ***very very*** primitive check, should be replaced with lodash.isPlainObject
export const isPlainObject = (v) => (
  !!v
  && typeof v === 'object'
  && typeof v.toString === 'function'
  && (v).toString() === '[object Object]'
);

export const createHashTable = (key, list = []) => (
  list.reduce(
    (res, item) => {
      if (!(key in item)) {
        throw new Error(`Key "${key}" is not specified in object => ${JSON.stringify(item)}`);
      }
      if (item[key] in res) {
        // eslint-disable-next-line max-len
        throw new Error(`Key duplication detected for key = "${key}" and value = "${item[key]}". Please, check passed objects carefully.`);
      }

      return {
        ...res,
        [item[key]]: item,
      };
    },
    {}
  )
);
