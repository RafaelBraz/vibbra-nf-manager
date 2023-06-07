export function removeObjectAttribute(obj: any, attribute: string) {
  if (!obj) return null;

  if (obj[attribute]) {
    delete obj[attribute];
  }

  return obj;
}
