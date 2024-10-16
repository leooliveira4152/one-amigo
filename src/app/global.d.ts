import pt from "@/features/locales/pt";

type Messages = typeof pt;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IntlMessages extends Messages {}
}
