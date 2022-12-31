import crypto from 'crypto-js';

export const encrypt = (text: any) => {
  const password: string = process.env.SECRET_KEY || "default password";
  let data = crypto.AES.encrypt(text, password);
  return data.toString();
};

export const decrypt = (text: string) => {
  const password: string = process.env.SECRET_KEY || "default password";
  const data = crypto.AES.decrypt(text, password);
  return data.toString(crypto.enc.Utf8);
};