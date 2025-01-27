import crypto from "crypto-js";
import slugify from "slugify";
import fs from "fs-extra";

export const generateHashFromContent = (
  content: string | crypto.lib.WordArray,
) => {
  const step1 = crypto.SHA512(content);
  const step2 = crypto.enc.Base64.stringify(step1);
  const step3 = step2.substring(0, 18);
  const step4 = slugify.default(step3);
  return step4;
};

export const generateHashFromFile = async (name: string) => {
  const content = await fs.readFile(name);
  const array = crypto.lib.WordArray.create(content);
  return generateHashFromContent(array);
};

export const generateHashFromFileSync = (name: string) => {
  const content = fs.readFileSync(name);
  const array = crypto.lib.WordArray.create(content);
  return generateHashFromContent(array);
};
