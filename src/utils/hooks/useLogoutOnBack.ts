import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { store } from '../../store';
import { logout } from '../../actions/auth/auth';
import { navigateBack } from '../../actions/navigation';
import { prompt } from '../../utils/prompt';
import { useAndroidBackButton } from '../../utils/hooks/useAndroidBackButton';

export const useLogoutOnBack = (
  enableBackButton = true,
  logoutOnBack = true,
) => {
  const { t } = useTranslation('goBackAlert');

  const handleBack = useMemo(() => {
    return enableBackButton
      ? () => {
          if (logoutOnBack) {
            prompt({
              title: t('title'),
              description: t('description'),
              actionLabel: t('action'),
            }).then(isLoggingOut => {
              if (isLoggingOut) {
                store.dispatch(logout());
              }
            });
          } else {
            store.dispatch(navigateBack());
          }
        }
      : undefined;
  }, [enableBackButton, logoutOnBack]);

  useAndroidBackButton(enableBackButton, handleBack);

  return handleBack;
};
