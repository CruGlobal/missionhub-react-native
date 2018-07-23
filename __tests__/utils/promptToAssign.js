import { Alert } from 'react-native';

import { promptToAssign } from '../../src/utils/promptToAssign';
import i18n from '../../src/i18n';

jest.mock('../../src/i18n');

Alert.alert = jest.fn().mockReturnValue(true);

beforeEach(() => (i18n.t = jest.fn(string => string)));

it('raises an alert', () => {
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
