import 'react-native';
import React from 'react';

import PersonSelectStepScreen from '../PersonSelectStepScreen';
import { renderWithContext } from '../../../testUtils';

const me = { id: '14312', user: { pathway_stage_id: '1' } };
const stageId = '2';
const organization = { id: '889' };
const contactAssignment = {
  id: '444',
  pathway_stage_id: stageId,
  assigned_to: { id: me.id },
};
const person = { id: '123', reverse_contact_assignments: [contactAssignment] };

const initialState = {
  auth: {
    person: me,
  },
  organizations: { all: [organization] },
  people: {
    allByOrg: {
      personal: { people: { [me.id]: me, [person.id]: person } },
      [organization.id]: { people: { [person.id]: person } },
    },
  },
  steps: {
    suggestedForMe: {},
    suggestedForOthers: {},
  },
};

const navParams = {
  personId: me.id,
  orgId: null,
  enableSkipButton: false,
};

it('renders correctly for me', () => {
  renderWithContext(<PersonSelectStepScreen next={jest.fn()} />, {
    initialState,
    navParams,
  }).snapshot();
});

it('renders correctly for other person', () => {
  renderWithContext(<PersonSelectStepScreen next={jest.fn()} />, {
    initialState,
    navParams: { ...navParams, personId: person.id },
  }).snapshot();
});

it('renders correctly for person in orgization', () => {
  renderWithContext(<PersonSelectStepScreen next={jest.fn()} />, {
    initialState,
    navParams: { ...navParams, personId: person.id, orgId: organization.id },
  }).snapshot();
});
