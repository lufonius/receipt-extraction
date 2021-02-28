type PartialShallow<T> = {
  [P in keyof T]?: T[P] extends object ? object : T[P]
};

export const groupBy = <T = string> (arrayOfObjects: T[], groupByProp: string | number | symbol): {[group: string]: T[]} => {
  const grouped: {[group: string]: T[]} = {};

  arrayOfObjects.forEach(it => {
    const propValue = it[groupByProp];
    const propValueAsString = propValue.toString();
    const alreadyGrouped = grouped[propValueAsString];

    if (!!alreadyGrouped) {
      grouped[propValueAsString].push(it);
    } else {
      grouped[propValueAsString] = [it];
    }
  });

  return grouped;
};
