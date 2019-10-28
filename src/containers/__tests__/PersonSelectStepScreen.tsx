import 'react-native';
import React from 'react';

import PersonSelectStepScreen from '../PersonSelectStepScreen';
import { contactAssignmentSelector } from '../../selectors/people';
import { renderWithContext } from '../../../testUtils';

jest.mock('../../selectors/people');

const myId = '14312';
const contactId = '123';
const stageId = '2';
const organization = { id: '889' };
const contactAssignment = { id: '444', pathway_stage_id: stageId };

const initialState = {
  personProfile: {},
  auth: {
    person: {
      id: myId,
    },
  },
  steps: {
    suggestedForOthers: {},
  },
};

const navParams = {
  contactName: 'Ron',
  contactId: contactId,
  contactStage: { id: stageId },
  contact: { id: contactId },
  organization,
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
    navParams: { ...navParams, organization: undefined },
  }).snapshot();
});
