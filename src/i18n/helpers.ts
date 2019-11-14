import { ResourceLanguage, Resource } from 'i18next';

interface OneSkyTranslation {
  translation: ResourceLanguage;
}

interface OneSkyTranslations {
  [languageTag: string]: OneSkyTranslation;
}

// Create alias mappings for base translations (key: alias languageTag, value: real languageTag)
export const createBaseLocaleAliases = (
  oneSkyTranslations: OneSkyTranslations,
) =>
  Object.keys(oneSkyTranslations).reduce(
    (baseAliases, languageTag) => ({
      ...baseAliases,
      [languageTag.split('-')[0]]: languageTag,
    }),
    {},
  );

// Flatten OneSky translations to remove extra `translations` key
export const mapOneSkyToResourceLanguages = (
  oneSkyTranslations: OneSkyTranslations,
) =>
  Object.entries(oneSkyTranslations).reduce(
    (resources, [localeTag, oneskyTranslation]) => ({
      ...resources,
      [localeTag]: oneskyTranslation.translation,
    }),
    {},
  );

export const aliasLanguages = (
  aliases: { [alias: string]: string },
  translations: Resource,
) => ({
  ...translations,
  // Clone language translations to aliases if alias doesn't yet exist
  ...Object.entries(aliases).reduce(
    (aliasedTranslations, [alias, real]) => ({
      ...aliasedTranslations,
      // Keep existing translations if language exists or copy aliased language translations
      [alias]: translations[alias] || translations[real],
    }),
    {},
  ),
});
