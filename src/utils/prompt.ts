import { Alert } from 'react-native';
import i18next from 'i18next';

export const promptToAssign = () =>
  prompt({
    title: i18next.t('assignAlert:question'),
    description: i18next.t('assignAlert:sentence'),
  });

export function prompt({
  title,
  description,
  cancelLabel = i18next.t('cancel'),
  actionLabel = i18next.t('continue'),
  actionDestructive = false,
}: {
  title: string;
  description: string;
  cancelLabel?: string;
  actionLabel?: string;
  actionDestructive?: boolean;
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
          style: actionDestructive ? 'destructive' : 'default',
          onPress: () => {
            resolve(true);
          },
        },
      ],
      { onDismiss: () => resolve(false) },
    ),
  );
}
