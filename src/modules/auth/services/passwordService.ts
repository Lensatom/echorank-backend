import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedSecret = await bcrypt.hash(password, salt);
  return hashedSecret;
}

export async function comparePassword(inputPassword: string, storedHashedPassword: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(inputPassword, storedHashedPassword);
  return isMatch;
}