import React from 'react';
import { ThunkAction } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';

import SelectStepScreen, { Step } from './SelectStepScreen';

interface SelectMyStepScreenProps {
  next: (nextProps: {
    personId: string;
    step?: Step;
  }) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ThunkAction<void, any, null, never>;
}

const SelectMyStepScreen = ({ next }: SelectMyStepScreenProps) => {
  const personId: string = useNavigationParam('personId');

  return <SelectStepScreen personId={personId} next={next} />;
};

export default SelectMyStepScreen;
export const SELECT_MY_STEP_SCREEN = 'nav/SELECT_MY_STEP';
export const SELECT_MY_STEP_ONBOARDING_SCREEN = 'nav/SELECT_MY_STEP_ONBOARDING';
