import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';

import { useLogoutOnBack } from '../utils/hooks/useLogoutOnBack';

import IconMessageScreen from './IconMessageScreen';

interface AddSomeoneScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: (props?: { skip: boolean }) => ThunkAction<void, any, null, never>;
  hideSkipBtn?: boolean;
  enableBackButton?: boolean;
  logoutOnBack?: boolean;
}

const AddSomeoneScreen = ({
  dispatch,
  next,
  hideSkipBtn = false,
  enableBackButton = true,
  logoutOnBack = false,
}: AddSomeoneScreenProps) => {
  const { t } = useTranslation('addContact');

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
      screenNameFragments={['onboarding', 'add someone']}
      onSkip={hideSkipBtn ? undefined : skip}
      onBack={handleBack}
    />
  );
};

export default connect()(AddSomeoneScreen);
export const ADD_SOMEONE_SCREEN = 'nav/ADD_SOMEONE';
