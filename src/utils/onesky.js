export function filterReadyTranslations(translationsRaw, languagesRaw) {
  let readyLanguages = JSON.parse(languagesRaw);
  readyLanguages = readyLanguages.data
    .filter(language => language.is_ready_to_publish)
    .map(language => language.code);

  const translations = JSON.parse(translationsRaw);

  const content = readyLanguages.reduce(
    (acc, language) => ({
      ...acc,
      [language]: translations[language],
    }),
    {},
  );

  return JSON.stringify(content);
}
