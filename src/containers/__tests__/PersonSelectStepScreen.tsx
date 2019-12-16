import 'react-native';
import React from 'react';

import PersonSelectStepScreen from '../PersonSelectStepScreen';
import { contactAssignmentSelector } from '../../selectors/people';
import { renderWithContext } from '../../../testUtils';

jest.mock('../../selectors/people');
jest.mock('../../utils/hooks/useTrackScreenChange');

const myId = '14312';
const personId = '123';
const stageId = '2';
const orgId = '889';
const contactAssignment = { id: '444', pathway_stage_id: stageId };

const initialState = {
  personProfile: {},
  auth: {
    person: {
      id: myId,
    },
  },
  organizations: {},
  steps: {
    suggestedForOthers: {},
  },
};

const navParams = {
  contactName: 'Ron',
  personId: personId,
  contactStage: { id: stageId },
  contact: { id: personId },
  orgId,
  enableBackButton: true,
  enableSkipButton: false,
};

it('renders correctly', () => {
  ((contactAssignmentSelector as unknown) as jest.Mock).mockReturnValue(
    contactAssignment,
  );
  renderWithContext(<PersonSelectStepScreen next={jest.fn()} />, {
    initialState,
    navParams,
  }).snapshot();
});

it('allows for undefined organization', () => {
  ((contactAssignmentSelector as unknown) as jest.Mock).mockReturnValue(
    contactAssignment,
  );
  renderWithContext(<PersonSelectStepScreen next={jest.fn()} />, {
    initialState,
    navParams: { ...navParams, orgId: undefined },
  }).snapshot();
});
