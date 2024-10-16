import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = "pt";

  return {
    locale,
    messages: (await import(`./${locale}.ts`)).default,
  };
});
