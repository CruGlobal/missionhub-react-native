import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';

import { useLogoutOnBack } from '../utils/hooks/useLogoutOnBack';

import IconMessageScreen from './IconMessageScreen';

interface AddSomeoneScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: (props?: { skip: boolean }) => ThunkAction<void, any, null, never>;
  hideSkipBtn?: boolean;
  enableBackButton?: boolean;
}

const AddSomeoneScreen = ({
  dispatch,
  next,
  hideSkipBtn = false,
  enableBackButton = true,
}: AddSomeoneScreenProps) => {
  const { t } = useTranslation('addContact');
  const logoutOnBack = useNavigationParam('logoutOnBack') || false;

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
      onBack={handleBack || undefined}
    />
  );
};

export default connect()(AddSomeoneScreen);
export const ADD_SOMEONE_SCREEN = 'nav/ADD_SOMEONE';
