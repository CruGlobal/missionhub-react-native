import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkAction } from 'redux-thunk';

import { useLogoutOnBack } from '../utils/hooks/useLogoutOnBack';
import { useAnalytics } from '../utils/hooks/useAnalytics';

import IconMessageScreen from './IconMessageScreen';

interface AddSomeoneScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: (props?: { skip: boolean }) => ThunkAction<void, any, null, never>;
  hideSkipBtn?: boolean;
  enableBackButton?: boolean;
  logoutOnBack?: boolean;
}

const AddSomeoneScreen = ({
  next,
  hideSkipBtn = false,
  enableBackButton = true,
  logoutOnBack = false,
}: AddSomeoneScreenProps) => {
  useAnalytics(['onboarding', 'add someone'], { sectionType: true });
  const { t } = useTranslation('addContact');
  const dispatch = useDispatch();

  const handleBack = useLogoutOnBack(enableBackButton, logoutOnBack);

  const handleNavigate = (skip = false) => {
    dispatch(next({ skip }));
  };

  const skip = () => handleNavigate(true);

  return (
    <IconMessageScreen
      mainText={t('message')}
      onComplete={handleNavigate}
      buttonText={t('addSomeone')}
      iconPath={require('../../assets/images/add_someone.png')}
      onSkip={hideSkipBtn ? undefined : skip}
      onBack={handleBack}
    />
  );
};

export default AddSomeoneScreen;
export const ADD_SOMEONE_SCREEN = 'nav/ADD_SOMEONE';
