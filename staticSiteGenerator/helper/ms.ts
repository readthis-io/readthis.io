import chalk from "chalk";

// Allow any here, for dynamic typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ms = async <T extends (...args: any[]) => Promise<any>>(
  name: string,
  method: (...args: Parameters<T>) => ReturnType<T>,
  ...args: Parameters<T>
): Promise<Awaited<ReturnType<T>>> => {
  const start = Date.now();

  const res = await method(...args);

  const end = Date.now();
  const duration = end - start;

  console.log(chalk.gray(`Completed "${name}" in ${duration}ms`));
  return res;
};
