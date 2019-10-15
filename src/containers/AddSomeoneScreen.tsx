import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';

import { logout } from '../actions/auth/auth';
import { navigateBack } from '../actions/navigation';
import { useAndroidBackButton } from '../utils/hooks/useAndroidBackButton';
import { prompt } from '../utils/prompt';

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
  const { t: goBackT } = useTranslation('goBackAlert');
  const logoutOnBack = useNavigationParam('logoutOnBack');

  const back = () => {
    if (logoutOnBack) {
      prompt({
        title: goBackT('title'),
        description: goBackT('description'),
        actionLabel: goBackT('action'),
      }).then(isLoggingOut => {
        if (isLoggingOut) {
          dispatch(logout());
        }
      });
    } else {
      dispatch(navigateBack());
    }
    return true;
  };

  useAndroidBackButton(enableBackButton, back);

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
      onBack={enableBackButton || logoutOnBack ? back : undefined}
    />
  );
};

export default connect()(AddSomeoneScreen);
export const ADD_SOMEONE_SCREEN = 'nav/ADD_SOMEONE';
