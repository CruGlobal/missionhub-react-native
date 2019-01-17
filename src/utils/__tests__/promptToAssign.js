import { Alert } from 'react-native';
import i18n from 'i18next';

import { promptToAssign } from '../promptToAssign';

jest.mock('../../i18n');

beforeEach(() => (i18n.t = jest.fn(string => string)));

it('raises an alert', () => {
  Alert.alert = jest.fn().mockReturnValue(true);

  promptToAssign();

  expect(Alert.alert).toHaveBeenCalledWith(
    'assignAlert:question',
    'assignAlert:sentence',
    [
      {
        text: 'cancel',
        style: 'cancel',
        onPress: expect.anything(),
      },
      {
        text: 'continue',
        style: 'default',
        onPress: expect.anything(),
      },
    ],
    { onDismiss: expect.anything() },
  );
});

it('returns false when cancel is clicked', async () => {
  Alert.alert = jest
    .fn()
    .mockImplementation((_, __, buttons) => buttons[0].onPress());

  expect(await promptToAssign()).toBe(false);
});

it('returns true when continue is clicked', async () => {
  Alert.alert = jest
    .fn()
    .mockImplementation((_, __, buttons) => buttons[1].onPress());

  expect(await promptToAssign()).toBe(true);
});

it('returns true when modal is dismissed', async () => {
  Alert.alert = jest
    .fn()
    .mockImplementation((_, __, ___, options) => options.onDismiss());

  expect(await promptToAssign()).toBe(false);
});
