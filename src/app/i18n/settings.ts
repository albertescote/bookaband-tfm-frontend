export const fallbackLng = 'en';
export const languages = [fallbackLng, 'ca', 'es'];
export const defaultNS = 'home';
export const cookieName = 'i18next';

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
