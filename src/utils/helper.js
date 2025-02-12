export function convertToPersianNumbers(number) {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return number?.toString().replace(/\d/g, (digit) => persianDigits[digit]);
}

export const addSlashesToDate = (date) => {
  if (date?.length !== 8) return date;
  return `${date.slice(0, 4)}/${date.slice(4, 6)}/${date.slice(6, 8)}`;
};
