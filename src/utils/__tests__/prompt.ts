import { Alert } from 'react-native';

import { prompt } from '../prompt';

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
