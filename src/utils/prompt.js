import { Alert } from 'react-native';

import i18n from '../i18n';

export const promptToAssign = () =>
  prompt({
    title: i18n.t('assignAlert:question'),
    description: i18n.t('assignAlert:sentence'),
  });

export function prompt({
  title,
  description,
  cancelLabel = i18n.t('cancel'),
  actionLabel = i18n.t('continue'),
}) {
  return new Promise(resolve =>
    Alert.alert(
      title,
      description,
      [
        {
          text: cancelLabel,
          style: 'cancel',
          onPress: () => resolve(false),
        },
        {
          text: actionLabel,
          style: 'default',
          onPress: () => {
            resolve(true);
          },
        },
      ],
      { onDismiss: () => resolve(false) },
    ),
  );
}
