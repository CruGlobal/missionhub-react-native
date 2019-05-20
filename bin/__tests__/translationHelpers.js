import { filterReadyTranslations } from '../translationHelpers';

const inputTranslations =
  '{"en":{"phrase1":"1"},"es":{"phrase1":"1"},"no":{"phrase1":"1"}}';
const outputTranslations = '{"en":{"phrase1":"1"},"no":{"phrase1":"1"}}';
const inputLanguages =
  '{"data":[{"code":"en","is_ready_to_publish":true},{"code":"es","is_ready_to_publish":false},{"code":"no","is_ready_to_publish":true}]}';

it('filter out not ready translations', () => {
  expect(filterReadyTranslations(inputTranslations, inputLanguages)).toEqual(
    outputTranslations,
  );
});
