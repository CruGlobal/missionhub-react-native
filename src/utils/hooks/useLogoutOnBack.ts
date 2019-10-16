import { useRef, useEffect } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import { useTranslation } from 'react-i18next';

import { logout } from '../../actions/auth/auth';
import { navigateBack } from '../../actions/navigation';
import { prompt } from '../../utils/prompt';
import { useAndroidBackButton } from '../../utils/hooks/useAndroidBackButton';

export const useLogoutOnBack = (
  enableBackButton = true,
  logoutOnBack = true,
) => {
  const { t } = useTranslation('goBackAlert');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { dispatch }: { dispatch: any } = useNavigation();

  const handleBack = useRef(undefined as (() => void) | undefined);

  useEffect(() => {
    if (enableBackButton) {
      handleBack.current = () => {
        if (logoutOnBack) {
          prompt({
            title: t('title'),
            description: t('description'),
            actionLabel: t('action'),
          }).then(isLoggingOut => {
            if (isLoggingOut) {
              dispatch(logout());
            }
          });
        } else {
          dispatch(navigateBack());
        }
      };
    } else {
      handleBack.current = undefined;
    }
  }, [enableBackButton, logoutOnBack]);

  useAndroidBackButton(enableBackButton, handleBack.current);

  return handleBack.current;
};
