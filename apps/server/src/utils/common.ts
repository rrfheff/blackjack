export const flattenObject = (
  object: Record<string, any>,
  path = '',
  result: Record<string, any> = {},
) => {
  for (const key in object) {
    const propName = path ? `${path}/${key}` : key;
    if (typeof object[key] === 'object') {
      flattenObject(object[key], propName, result);
    } else {
      result[propName] = object[key];
    }
  }
  return result;
};
