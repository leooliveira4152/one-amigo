export const endsWithAtNumber = (str: string): boolean => {
  const regex = /@\d+$/;
  return regex.test(str);
};
