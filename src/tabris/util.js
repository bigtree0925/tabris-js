export function pick(object, keys) {
  const result = {};
  for (const key in object) {
    if (keys.includes(key)) {
      result[key] = object[key];
    }
  }
  return result;
}

export function omit(object, keys) {
  const result = {};
  for (const key in object) {
    if (!keys.includes(key)) {
      result[key] = object[key];
    }
  }
  return result;
}

export function isObject(value) {
  return value !== null && typeof value === 'object';
}

export function capitalizeFirstChar(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function normalizePath(path) {
  if (typeof path !== 'string') {
    throw new Error('must be a string');
  }
  if (path === '') {
    throw new Error('must not be empty');
  }
  const prefix = path.startsWith('/') ? '/' : '';
  const segments = [];
  const pathSegments = path.split('/');
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    if (segment === '..') {
      const removed = segments.pop();
      if (!removed || removed === '.') {
        throw new Error('Path must not start with \'..\'');
      }
    } else if (segment !== '.' && segment !== '') {
      segments.push(segment);
    }
  }
  if (!segments.length) {
    return prefix || '.';
  }
  return prefix + segments.join('/');
}

export function normalizePathUrl(url) {
  if (typeof url !== 'string') {
    throw new Error('must be a string');
  }
  const parts = /^([a-z-]+:(\/\/)?)?(.*)/.exec(url);
  const schema = parts[1] || '';
  const content = parts[3] || '';
  if (schema === 'data:') {
    return url;
  }
  return schema + normalizePath(content);
}

export function dirname(path) {
  if (!path || path.slice(0, 1) !== '.') {
    return './';
  }
  return path.slice(0, path.lastIndexOf('/'));
}

/**
 * Check if a given value is a number and in closed range.
 * @param value Value to check.
 * @param range An array of min and max value of a closed range.
 * @param errorPrefix Prefix to prepend to messages of thrown errors.
 */
export function checkNumber(value, range = [-Infinity, Infinity], errorPrefix) {
  const prefix = errorPrefix ? errorPrefix + ': ' : '';
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    throw new Error(`${prefix}Invalid number ${value}`);
  }
  if (value < range[0] || value > range[1]) {
    throw new Error(`${prefix}Number ${value} out of range`);
  }
}
