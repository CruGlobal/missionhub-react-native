import { Alert } from 'react-native';
import i18n from '../i18n';

export function promptToAssign() {
  return new Promise(resolve =>
    Alert.alert(
      i18n.t('assignAlert:question'),
      i18n.t('assignAlert:sentence'),
      [
        {
          text: i18n.t('cancel'),
          style: 'cancel',
          onPress: () => resolve(false),
        },
        {
          text: i18n.t('continue'),
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
