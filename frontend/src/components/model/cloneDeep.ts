type PropertyModifier = (propValue: any) => any;
type PropertyModifiers = {[path: string]: PropertyModifier};
export const cloneDeep = <T, R = T> (
  objOrArray: T,
  modifiers: PropertyModifiers = {}
): R => {
  if (Array.isArray(objOrArray)) {
    // @ts-ignore
    return objOrArray.map(it => cloneObject(it, "", modifiers));
  } else if (isObject(objOrArray)) {
    return cloneObject(objOrArray, "", modifiers);
  } else {
    return objOrArray;
  }
};

const cloneObject = <T, R>(
  obj: T,
  startPath: string,
  modifiers: PropertyModifiers
): R => {
  let clonedObject = {};
  for (let key in obj) {
    const keyName = key.toString();
    const prop = obj[keyName];
    const nestedStartPath = `${startPath}.${keyName}`;
    if (isArray(prop)) {
      clonedObject[keyName] = prop.map(it => {
        const propWithModifierApplied = applyModifierIfNeeded(modifiers, nestedStartPath, it);
        return cloneObject(propWithModifierApplied, nestedStartPath, modifiers);
      });
    } else if (isObject(prop)) {
      const propWithModifierApplied = applyModifierIfNeeded(modifiers, nestedStartPath, prop);
      clonedObject[keyName] = cloneObject(propWithModifierApplied, nestedStartPath, modifiers);
    } else {
      clonedObject[keyName] = applyModifierIfNeeded(modifiers, nestedStartPath, prop);
    }
  }

  // @ts-ignore
  return clonedObject;
};

const applyModifierIfNeeded = (modifiers: PropertyModifiers, propPath: string, propValue: any): any => {
  const modifier = modifiers[propPath];
  if (!!modifier) {
    return modifier(propValue);
  } else {
    return propValue;
  }
};

const isArray = (obj: any): obj is Array<Object> => {
  return Array.isArray(obj);
};

const isObject = (obj: any): obj is Object => {
  return typeof obj === 'object' && !Array.isArray(obj) && obj !== null;
};
