import ptTranslateFile from "@/features/locales/pt";

jest.mock("next-intl", () => {
  const actual = jest.requireActual("next-intl");
  const translate = actual.createTranslator({
    locale: "pt",
    messages: ptTranslateFile,
  });

  return {
    ...actual,
    useTranslations: jest.fn(() => translate),
  };
});
