import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkAction } from 'redux-thunk';

import { contactAssignmentSelector, personSelector } from '../selectors/people';
import { AuthState } from '../reducers/auth';
import { PeopleState } from '../reducers/people';
import { PersonProfileState } from '../reducers/personProfile';
import { OrganizationsState } from '../reducers/organizations';

import SelectStepScreen from './SelectStepScreen';

interface PersonSelectStepScreenProps {
  contactName: string;
  contactId: string;
  contactStage: {
    id: string;
  };
  contactAssignment: {
    pathway_stage_id: string;
  };
  personFirstName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  personId: string | null;
  organization: OrganizationsState;
  next: (nextProps: {
    receiverId: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    step?: any | undefined;
    skip: boolean;
    orgId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => ThunkAction<void, any, any, never>;
  enableSkipButton: boolean;
}

const PersonSelectStepScreen = ({
  contactName,
  contactId,
  contactStage,
  contactAssignment,
  personFirstName,
  personId,
  organization,
  next,
  enableSkipButton,
}: PersonSelectStepScreenProps) => {
  const { t } = useTranslation('selectStep');
  const name = contactName ? contactName : personFirstName;
  const stageId = contactAssignment
    ? contactAssignment.pathway_stage_id
    : contactStage.id;

  return (
    <SelectStepScreen
      contactStageId={stageId}
      receiverId={contactId ? contactId : personId}
      contactName={name}
      headerText={[t('personHeader.part1'), t('personHeader.part2', { name })]}
      organization={organization}
      enableSkipButton={enableSkipButton}
      next={next}
    />
  );
};

const mapStateToProps = (
  {
    personProfile,
    auth,
    people,
  }: {
    personProfile: PersonProfileState;
    auth: AuthState;
    people: PeopleState;
  },
  {
    navigation: {
      state: {
        params: {
          contactName,
          contactId,
          contactStage,
          organization = {},
          enableSkipButton,
        },
      },
    },
    next,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
) => {
  const person = personSelector(
    { people },
    { personId: contactId, orgId: organization.id },
  );

  return {
    contactName,
    contactId,
    contactStage,
    organization,
    enableSkipButton,
    next,
    personFirstName: personProfile.personFirstName,
    personId: personProfile.id,
    contactAssignment:
      person &&
      contactAssignmentSelector(
        { auth },
        {
          person,
          orgId: organization.id,
        },
      ),
  };
};

export default connect(mapStateToProps)(PersonSelectStepScreen);
export const PERSON_SELECT_STEP_SCREEN = 'nav/PERSON_SELECT_STEP';
