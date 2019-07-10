import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';

import { navigatePush, navigateBack } from '../actions/navigation';
import { skipOnboarding } from '../actions/onboardingProfile';
import { useDisableBack } from '../utils/hooks/useDisableBack';

import { SETUP_PERSON_SCREEN } from './SetupPersonScreen';
import IconMessageScreen from './IconMessageScreen';

interface AddSomeoneScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next?: (props?: { skip: boolean }) => ThunkAction<void, any, null, never>; // TODO: make next required when only used in flows
  hideSkipBtn: boolean;
}

const AddSomeoneScreen = ({
  dispatch,
  next,
  hideSkipBtn = false,
}: AddSomeoneScreenProps) => {
  const { t } = useTranslation('addContact');

  const enableBack = useDisableBack();

  const handleNavigate = (skip = false) => {
    enableBack();

    if (next) {
      return dispatch(next({ skip }));
    }

    dispatch(skip ? skipOnboarding() : navigatePush(SETUP_PERSON_SCREEN));
  };

  const skip = () => handleNavigate(true);
  const back = () => dispatch(navigateBack());

  return (
    <IconMessageScreen
      mainText={t('message')}
      onComplete={handleNavigate}
      buttonText={t('addSomeone')}
      iconPath={require('../../assets/images/add_someone.png')}
      onSkip={hideSkipBtn ? undefined : skip}
      onBack={hideSkipBtn ? back : undefined}
    />
  );
};

export default connect()(AddSomeoneScreen);
export const ADD_SOMEONE_SCREEN = 'nav/ADD_SOMEONE';
