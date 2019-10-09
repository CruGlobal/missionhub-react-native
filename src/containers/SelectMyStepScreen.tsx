import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkAction } from 'redux-thunk';

import { Person } from '../reducers/people';
import { AuthState } from '../reducers/auth';

import SelectStepScreen, { Step } from './SelectStepScreen';

interface SelectMyStepScreenProps {
  me: Person;
  stageId: string;
  next: (nextProps: {
    receiverId: string;
    step?: Step;
  }) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ThunkAction<void, any, null, never>;
}

const SelectMyStepScreen = ({ me, stageId, next }: SelectMyStepScreenProps) => {
  const { t } = useTranslation('selectStep');

  return (
    <SelectStepScreen
      contactStageId={stageId}
      receiverId={me.id}
      headerText={t('meHeader')}
      next={next}
    />
  );
};

const mapStateToProps = ({ auth }: { auth: AuthState }) => ({
  me: auth.person,
  stageId: (auth.person.user || {}).pathway_stage_id,
});

export default connect(mapStateToProps)(SelectMyStepScreen);
export const SELECT_MY_STEP_SCREEN = 'nav/SELECT_MY_STEP';
export const SELECT_MY_STEP_ONBOARDING_SCREEN = 'nav/SELECT_MY_STEP_ONBOARDING';
