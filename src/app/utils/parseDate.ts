export const parseDate = (dateStr: string): Date | null => {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;

  const [day, month, year] = parts;
  const isoString = `${year}-${month}-${day}`;
  const date = new Date(isoString);
  return isNaN(date.getTime()) ? null : date;
};
