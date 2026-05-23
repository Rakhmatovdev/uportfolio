import en from '@/messages/en.json';
import ru from '@/messages/ru.json';
import uz from '@/messages/uz.json';

export const locales = ['en', 'ru', 'uz'] as const;
export type Locale = (typeof locales)[number];

const dictionaries = {
  en,
  ru,
  uz,
};

export const getDictionary = (locale: Locale) => {
  return dictionaries[locale] || dictionaries.en;
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
