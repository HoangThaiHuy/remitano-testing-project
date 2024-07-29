import { hashSync, compareSync } from 'bcryptjs';
import * as OtpGenerator from 'otp-generator';
import * as crypto from 'crypto';

/**
 * Returns hashed password by hash password.
 *
 * @remarks
 * This method is part of the {@link utils/password}.
 *
 * @param password - 1st input number
 * @returns The hashed password mean of `password`
 *
 * @beta
 */
export const hashPassword = (
  password: string,
  saltRound = 10,
) => {
  return hashSync(password, saltRound);
};

/**
 * Returns boolean by compare password.
 *
 * @remarks
 * This method is part of the {@link utils/password}.
 *
 * @param password - 1st input number
 * @param hash - The second input number
 * @returns The boolean mean of `password` and `hash`
 *
 * @beta
 */
export const comparePassword = (
  password: string,
  hash: string,
) => {
  return compareSync(password, hash);
};


export const generateOTP = (): string => {
  return OtpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
}


export const generateSecretKey = (): string => {
  return crypto.randomBytes(48).toString('base64');
}