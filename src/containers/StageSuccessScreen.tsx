import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import { navigateBack } from '../actions/navigation';
import { useAnalytics } from '../utils/hooks/useAnalytics';
import { RootState } from '../reducers';
import { useAuthPerson } from '../auth/authHooks';

import IconMessageScreen from './IconMessageScreen';

type SelectedStage = { self_followup_description?: string } | undefined;

interface StageSuccessScreenProps {
  next: (props?: {
    selectedStage: SelectedStage;
  }) => ThunkAction<void, RootState, never, AnyAction>; // TODO: make next
}

const StageSuccessScreen = ({ next }: StageSuccessScreenProps) => {
  useAnalytics(['onboarding', 'stage confirmation']);
  const dispatch = useDispatch();
  const { t } = useTranslation('stageSuccess');
  const { firstName, stage } = useAuthPerson();

  const handleNavigateToStep = () => dispatch(next());
  const back = () => dispatch(navigateBack());

  // Build out message
  const message = (
    stage?.selfFollowupDescription ??
    t('backupMessage') ??
    ''
  ).replace('<<user>>', firstName ? firstName : t('friend'));
  return (
    <IconMessageScreen
      testID="IconMessageScreen"
      mainText={message}
      buttonText={t('chooseSteps')}
      onComplete={handleNavigateToStep}
      iconPath={require('../../assets/images/pathFinder.png')}
      onBack={back}
    />
  );
};

export default StageSuccessScreen;
export const STAGE_SUCCESS_SCREEN = 'nav/STAGE_SUCCESS';
