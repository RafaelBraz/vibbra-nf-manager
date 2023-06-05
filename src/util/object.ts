export function removeObjectAttribute(obj: any, attribute: string) {
  if (obj[attribute]) {
    delete obj[attribute];
  }

  return obj;
}
