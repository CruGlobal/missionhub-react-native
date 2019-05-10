import process from 'process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import oneSky from '@brainly/onesky-utils';

dotenv.config({ path: '.env.local' });

async function downloadTranslations() {
  const options = {
    apiKey: process.env.ONESKY_API_KEY,
    secret: process.env.ONESKY_SECRET_KEY,
    projectId: '292283',
  };
  const multilingualOptions = {
    ...options,
    fileName: 'en-us.json',
    format: 'I18NEXT_MULTILINGUAL_JSON',
  };

  console.log('Downloading from OneSky...');
  try {
    const translationsRaw = await oneSky.getMultilingualFile(
      multilingualOptions,
    );
    const languageOptions = await oneSky.getLanguageOptions(options);
    console.log('Successfully Downloaded.');

    const readyLanguages = languageOptions.data
      .filter(language => language.is_ready_to_publish)
      .map(language => language.code);

    const translations = readyLanguages.reduce(
      (acc, language) => ({
        ...acc,
        [language]: translationsRaw[language],
      }),
      {},
    );

    console.log('Writing translations.json...');
    fs.writeFileSync(
      path.resolve(__dirname, '../src/i18n/locales/translations.json'),
      translations,
    );
    console.log('Done.');
  } catch (error) {
    console.log('Error downloading from OneSky:');
    console.log(error);
    process.exit(1);
  }
}

downloadTranslations();
