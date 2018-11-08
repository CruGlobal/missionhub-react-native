import React from 'react';

import {
  ChallengeDetailScreen,
  mapStateToProps,
  CHALLENGE_DETAIL_TABS,
} from '../../src/containers/ChallengeDetailScreen';
import { ADD_CHALLENGE_SCREEN } from '../../src/containers/AddChallengeScreen';
import { testSnapshotShallow, renderShallow } from '../../testUtils';
import { navigateBack, navigatePush } from '../../src/actions/navigation';
import {
  getChallenge,
  joinChallenge,
  completeChallenge,
  updateChallenge,
} from '../../src/actions/challenges';
import { communityChallengeSelector } from '../../src/selectors/challenges';
import { orgPermissionSelector } from '../../src/selectors/people';
import { ORG_PERMISSIONS } from '../../src/constants';

jest.mock('../../src/actions/navigation');
jest.mock('../../src/actions/challenges');
jest.mock('../../src/selectors/challenges');
jest.mock('../../src/selectors/people');

const myId = '1111';
const orgId = '123';
const organization = { id: orgId };

const date = '2018-09-22';
const joinedChallenge = { id: 'a1', person: { id: myId } };
const completedChallenge = { ...joinedChallenge, completed_at: date };
const challengeId = '1';
const challenge = {
  id: challengeId,
  title: 'Read "There and Back Again"',
  end_date: date,
  isPast: false,
  accepted_community_challenges: [joinedChallenge],
};

const unjoinedProps = {
  challenge,
  orgId,
  myId,
  onComplete: jest.fn(),
  onJoin: jest.fn(),
  onEdit: jest.fn(),
  canEditChallenges: true,
  acceptedChallenge: undefined,
  dispatch: jest.fn(),
};
const joinedProps = {
  ...unjoinedProps,
  acceptedChallenge: joinedChallenge,
};
const completedProps = {
  ...unjoinedProps,
  acceptedChallenge: completedChallenge,
};

const orgPermission = {
  organization_id: '456',
  permission_id: ORG_PERMISSIONS.ADMIN,
};

const store = {
  auth: {
    person: {
      id: myId,
      organizational_permissions: [orgPermission],
    },
  },
  organizations: {
    all: [organization],
  },
};

const nav = {
  navigation: {
    state: {
      params: {
        orgId,
        challengeId,
      },
    },
  },
};

it('should provide necessary props', () => {
  communityChallengeSelector.mockReturnValue(challenge);
  orgPermissionSelector.mockReturnValue(orgPermission);

  expect(mapStateToProps(store, nav)).toEqual({
    ...nav.navigation.state.params,
    canEditChallenges: true,
    challenge,
    acceptedChallenge: joinedChallenge,
    myId,
  });
});

it('should render unjoined challenge correctly', () => {
  testSnapshotShallow(<ChallengeDetailScreen {...unjoinedProps} />);
  expect(getChallenge).toHaveBeenCalledWith(challengeId);
});

it('should render joined challenge correctly', () => {
  testSnapshotShallow(<ChallengeDetailScreen {...joinedProps} />);
  expect(getChallenge).toHaveBeenCalledWith(challengeId);
});

it('should render completed challenge correctly', () => {
  testSnapshotShallow(<ChallengeDetailScreen {...completedProps} />);
  expect(getChallenge).toHaveBeenCalledWith(challengeId);
});

it('should call joinChallenge from press', () => {
  const component = renderShallow(
    <ChallengeDetailScreen {...unjoinedProps} />,
    store,
  );
  component
    .find('Connect(Header)')
    .props()
    .right.props.onPress();

  expect(joinChallenge).toHaveBeenCalledWith(challenge, orgId);
});

it('should call completeChallenge from press', () => {
  const component = renderShallow(
    <ChallengeDetailScreen {...joinedProps} />,
    store,
  );
  component
    .find('Connect(Header)')
    .props()
    .right.props.onPress();

  expect(completeChallenge).toHaveBeenCalledWith(
    joinedProps.acceptedChallenge,
    orgId,
  );
});

it('should navigate to edit screen from press', () => {
  const component = renderShallow(
    <ChallengeDetailScreen {...joinedProps} />,
    store,
  );
  component.instance().handleEdit();

  expect(navigatePush).toHaveBeenCalledWith(ADD_CHALLENGE_SCREEN, {
    isEdit: true,
    challenge,
    onComplete: expect.any(Function),
  });
});

it('should call updateChallenge', () => {
  const component = renderShallow(
    <ChallengeDetailScreen {...joinedProps} />,
    store,
  );
  component.instance().editChallenge(challenge);

  expect(updateChallenge).toHaveBeenCalledWith(challenge, orgId);
});

it('should call navigateBack from press', () => {
  const component = renderShallow(
    <ChallengeDetailScreen {...joinedProps} dispatch={jest.fn()} />,
    store,
  );
  component
    .find('Connect(Header)')
    .props()
    .left.props.onPress();

  expect(navigateBack).toHaveBeenCalled();
});

it('should render tabs correctly', () => {
  expect(CHALLENGE_DETAIL_TABS).toMatchSnapshot();
});
