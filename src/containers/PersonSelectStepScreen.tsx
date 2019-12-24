import React from 'react';
import { useNavigationParam } from 'react-navigation-hooks';
import { ThunkAction } from 'redux-thunk';

import SelectStepScreen, { Step } from './SelectStepScreen';

interface PersonSelectStepScreenProps {
  next: (nextProps: {
    personId: string;
    step?: Step;
    skip: boolean;
    orgId?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => ThunkAction<void, any, any, never>;
}

const PersonSelectStepScreen = ({ next }: PersonSelectStepScreenProps) => {
  const personId: string = useNavigationParam('personId');
  const orgId: string | undefined = useNavigationParam('orgId');
  const enableSkipButton: boolean =
    useNavigationParam('enableSkipButton') || false;

  return (
    <SelectStepScreen
      personId={personId}
      orgId={orgId}
      enableSkipButton={enableSkipButton}
      next={next}
    />
  );
};

export default PersonSelectStepScreen;
export const PERSON_SELECT_STEP_SCREEN = 'nav/PERSON_SELECT_STEP';
