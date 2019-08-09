/* eslint max-params: 0 */

import { Alert } from 'react-native';
import i18next from 'i18next';

import { prompt, promptToAssign } from '../prompt';

it('raises an alert', () => {
  Alert.alert = jest.fn().mockReturnValue(true);
  const title = 'Test Title';
  const description = 'Test Description';
  prompt({ title, description });

  expect(Alert.alert).toHaveBeenCalledWith(
    title,
    description,
    [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: expect.any(Function),
      },
      {
        text: 'Continue',
        style: 'default',
        onPress: expect.any(Function),
      },
    ],
    { onDismiss: expect.any(Function) },
  );
});

it('raises an alert with cancel label and desctructive action label', () => {
  Alert.alert = jest.fn().mockReturnValue(true);
  const title = 'Test Title';
  const description = 'Test Description';
  const cancelLabel = 'Custom Cancel';
  const actionLabel = 'Custom Action Label';
  prompt({
    title,
    description,
    cancelLabel,
    actionLabel,
    actionDestructive: true,
  });

  expect(Alert.alert).toHaveBeenCalledWith(
    title,
    description,
    [
      {
        text: cancelLabel,
        style: 'cancel',
        onPress: expect.any(Function),
      },
      {
        text: actionLabel,
        style: 'destructive',
        onPress: expect.any(Function),
      },
    ],
    { onDismiss: expect.any(Function) },
  );
});

it('raises an alert with assign prompt', () => {
  Alert.alert = jest.fn().mockReturnValue(true);

  promptToAssign();

  expect(Alert.alert).toHaveBeenCalledWith(
    i18next.t('assignAlert:question'),
    i18next.t('assignAlert:sentence'),
    [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: expect.any(Function),
      },
      {
        text: 'Continue',
        style: 'default',
        onPress: expect.any(Function),
      },
    ],
    { onDismiss: expect.any(Function) },
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
