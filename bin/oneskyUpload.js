import process from 'process';
import dotenv from 'dotenv';
import oneSky from '@brainly/onesky-utils';
import translations from '../src/i18n/locales/en-US';

dotenv.config({ path: '.env.local' });

async function uploadTranslations() {
  const options = {
    language: 'en-US',
    apiKey: process.env.ONESKY_API_KEY,
    secret: process.env.ONESKY_SECRET_KEY,
    projectId: '292283',
    fileName: 'en-us.json',
    format: 'HIERARCHICAL_JSON',
    content: JSON.stringify(translations),
    keepStrings: true,
  };

  console.log('Uploading to OneSky...');
  try {
    await oneSky.postFile(options);
    console.log('Successfully Uploaded.');
  } catch (error) {
    console.log('Error uploading to OneSky:');
    console.log(error);
    process.exit(1);
  }
}

uploadTranslations();
