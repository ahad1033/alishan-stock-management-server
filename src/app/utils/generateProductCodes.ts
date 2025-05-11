export const generateUniqueCode = (): string => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
};

export const generateUniqueCodes = (count: number): string[] => {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    let code = generateUniqueCode();
    // Ensure the code is unique
    while (codes.includes(code)) {
      code = generateUniqueCode();
    }
    codes.push(code);
  }
  return codes;
};
