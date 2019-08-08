import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useNavigationParam } from 'react-navigation-hooks';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';

import { navigateBack } from '../actions/navigation';
import { ProfileState } from '../reducers/profile';

import IconMessageScreen from './IconMessageScreen/index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DispatchType = ThunkDispatch<any, null, never>;
type SelectedStage = { self_followup_description?: string } | undefined;

interface StageSuccessScreenProps {
  dispatch: DispatchType;
  next: (props?: {
    selectedStage: SelectedStage;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => ThunkAction<void, any, null, never>; // TODO: make next
  selectedStage?: object;
  firstName?: string;
}

const StageSuccessScreen = ({
  dispatch,
  next,
  firstName,
}: StageSuccessScreenProps) => {
  const selectedStage: SelectedStage = useNavigationParam('selectedStage');
  const { t } = useTranslation('stageSuccess');

  const handleNavigateToStep = () => dispatch(next({ selectedStage }));
  const back = () => dispatch(navigateBack());

  // Build out message
  let message =
    selectedStage && selectedStage.self_followup_description
      ? selectedStage.self_followup_description
      : t('backupMessage');
  message = message.replace('<<user>>', firstName ? firstName : t('friend'));
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

const mapStateToProps = ({ profile }: { profile: ProfileState }) => ({
  firstName: profile.firstName,
});
export default connect(mapStateToProps)(StageSuccessScreen);
export const STAGE_SUCCESS_SCREEN = 'nav/STAGE_SUCCESS';
