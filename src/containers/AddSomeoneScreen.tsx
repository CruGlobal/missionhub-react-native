import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';

import { navigateBack } from '../actions/navigation';
import { useDisableBack } from '../utils/hooks/useDisableBack';

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
  const skip = () => handleNavigate(true);
  const back = () => dispatch(navigateBack());

  useDisableBack(enableBackButton, back);
  const { t } = useTranslation('addContact');

  const handleNavigate = (skip = false) => {
    dispatch(next({ skip }));
  };

  return (
    <IconMessageScreen
      mainText={t('message')}
      onComplete={handleNavigate}
      buttonText={t('addSomeone')}
      iconPath={require('../../assets/images/add_someone.png')}
      onSkip={hideSkipBtn ? undefined : skip}
      onBack={enableBackButton ? back : undefined}
    />
  );
};

export default connect()(AddSomeoneScreen);
export const ADD_SOMEONE_SCREEN = 'nav/ADD_SOMEONE';
