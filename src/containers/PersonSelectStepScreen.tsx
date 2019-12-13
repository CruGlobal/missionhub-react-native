import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkAction } from 'redux-thunk';

import { contactAssignmentSelector, personSelector } from '../selectors/people';
import { AuthState } from '../reducers/auth';
import { PeopleState, Person } from '../reducers/people';
import { useTrackScreenChange } from '../utils/hooks/useTrackScreenChange';

import SelectStepScreen, { Step } from './SelectStepScreen';

interface PersonSelectStepScreenProps {
  contactName: string;
  contactStage: {
    id: string;
  };
  contactAssignment: {
    pathway_stage_id: string;
  };
  person: Person;
  personId: string;
  orgId: string;
  next: (nextProps: {
    personId: string;
    step?: Step;
    skip: boolean;
    orgId?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => ThunkAction<void, any, any, never>;
  enableSkipButton: boolean;
}

const PersonSelectStepScreen = ({
  contactName,
  contactStage,
  contactAssignment,
  person,
  personId,
  orgId,
  next,
  enableSkipButton,
}: PersonSelectStepScreenProps) => {
  useTrackScreenChange(['add step']);
  const { t } = useTranslation('selectStep');
  const name = contactName ? contactName : person.first_name;
  const stageId = contactAssignment
    ? contactAssignment.pathway_stage_id
    : contactStage.id;

  return (
    <SelectStepScreen
      contactStageId={stageId}
      personId={personId}
      contactName={name}
      headerText={[t('personHeader.part1'), t('personHeader.part2', { name })]}
      orgId={orgId}
      enableSkipButton={enableSkipButton}
      next={next}
    />
  );
};

const mapStateToProps = (
  {
    auth,
    people,
  }: {
    auth: AuthState;
    people: PeopleState;
  },
  {
    navigation: {
      state: {
        params: {
          contactName,
          personId,
          contactStage,
          orgId,
          enableSkipButton,
        },
      },
    },
    next,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
) => {
  const person = personSelector({ people }, { personId, orgId });

  return {
    contactName,
    person,
    personId,
    contactStage,
    orgId,
    enableSkipButton,
    next,
    contactAssignment:
      person &&
      contactAssignmentSelector(
        { auth },
        {
          person,
          orgId,
        },
      ),
  };
};

export default connect(mapStateToProps)(PersonSelectStepScreen);
export const PERSON_SELECT_STEP_SCREEN = 'nav/PERSON_SELECT_STEP';
