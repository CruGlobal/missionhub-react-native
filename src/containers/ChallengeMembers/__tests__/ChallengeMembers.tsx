import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils';
import { navToPersonScreen } from '../../../actions/person';
import { organizationSelector } from '../../../selectors/organizations';
import {
  communityChallengeSelector,
  acceptedChallengesSelector,
} from '../../../selectors/challenges';

import ChallengeMembers from '..';

jest.mock('../../../actions/person');
jest.mock('../../../selectors/organizations');
jest.mock('../../../selectors/challenges');

const orgId = '1';
const challengeId = '11';

const accepted_community_challenges = [
  {
    id: '111',
    person: { id: '111' },
  },
  {
    id: '112',
    person: { id: '112' },
  },
  {
    id: '113',
    person: { id: '113' },
  },
];
const challenge = {
  id: challengeId,
  accepted_community_challenges,
};
const organization = {
  id: orgId,
  challengeItems: [challenge],
};
const organizations = {
  all: [organization],
};

const store = configureStore([thunk])({
  organizations,
});

const sortedAcceptedChallenges = {
  joined: [
    {
      id: '111',
      person: { id: '111' },
    },
  ],
  completed: [
    {
      id: '112',
      person: { id: '112' },
    },
    {
      id: '113',
      person: { id: '113' },
    },
  ],
};

const navResponse = { type: 'nav to person screen ' };

// @ts-ignore
organizationSelector.mockReturnValue(organization);
// @ts-ignore
communityChallengeSelector.mockReturnValue(challenge);
// @ts-ignore
acceptedChallengesSelector.mockReturnValue(sortedAcceptedChallenges);
// @ts-ignore
navToPersonScreen.mockReturnValue(navResponse);

let props = {
  orgId,
  challengeId,
};

// @ts-ignore
let component;

const buildComponent = () => {
  // @ts-ignore
  component = renderShallow(<ChallengeMembers {...props} />, store);

  expect(organizationSelector).toHaveBeenCalledWith(
    { organizations },
    { orgId },
  );
  expect(communityChallengeSelector).toHaveBeenCalledWith(
    { organizations },
    { orgId, challengeId },
  );
  expect(acceptedChallengesSelector).toHaveBeenCalledWith({
    acceptedChallenges: accepted_community_challenges,
  });
};

it('renders correctly for joined members', () => {
  // @ts-ignore
  props = { ...props, completed: false };
  buildComponent();

  // @ts-ignore
  expect(component).toMatchSnapshot();
});

it('renders correctly for completed members', () => {
  // @ts-ignore
  props = { ...props, completed: true };
  buildComponent();

  // @ts-ignore
  expect(component).toMatchSnapshot();
});

it('navigates to person screen on select row', () => {
  // @ts-ignore
  props = { ...props, completed: true };
  buildComponent();

  const item = accepted_community_challenges[0];
  // @ts-ignore
  const row = component
    .childAt(0)
    .props()
    .renderItem({ item });
  row.props.onSelect(item.person);

  expect(navToPersonScreen).toHaveBeenCalledWith(item.person, organization);
  expect(store.getActions()).toEqual([navResponse]);
});