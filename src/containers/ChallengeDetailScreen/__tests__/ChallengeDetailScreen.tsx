import React from 'react';

import { ADD_CHALLENGE_SCREEN } from '../../AddChallengeScreen';
import { testSnapshotShallow, renderShallow } from '../../../../testUtils';
import { navigateBack, navigatePush } from '../../../actions/navigation';
import {
  getChallenge,
  joinChallenge,
  completeChallenge,
  updateChallenge,
} from '../../../actions/challenges';
import { communityChallengeSelector } from '../../../selectors/challenges';
import { orgPermissionSelector } from '../../../selectors/people';
import { ORG_PERMISSIONS } from '../../../constants';

import {
  ChallengeDetailScreen,
  mapStateToProps,
  CHALLENGE_DETAIL_TABS,
} from '..';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/challenges');
jest.mock('../../../selectors/challenges');
jest.mock('../../../selectors/people');

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
  analyticsPermissionType: 'owner',
};
const joinedProps = {
  ...unjoinedProps,
  acceptedChallenge: joinedChallenge,
};
const completedProps = {
  ...unjoinedProps,
  acceptedChallenge: completedChallenge,
};
const noEditProps = {
  ...unjoinedProps,
  canEditChallenges: false,
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

describe('mapStateToProps', () => {
  beforeEach(() => {
    // @ts-ignore
    communityChallengeSelector.mockReturnValue(challenge);
    // @ts-ignore
    orgPermissionSelector.mockReturnValue(orgPermission);
  });

  it('should provide necessary props for Member', () => {
    // @ts-ignore
    orgPermissionSelector.mockReturnValue({
      ...orgPermission,
      permission_id: ORG_PERMISSIONS.USER,
    });

    expect(mapStateToProps(store, nav)).toEqual({
      ...nav.navigation.state.params,
      canEditChallenges: false,
      challenge,
      acceptedChallenge: joinedChallenge,
      myId,
      analyticsPermissionType: 'member',
    });
  });

  it('should provide necessary props for Admin', () => {
    expect(mapStateToProps(store, nav)).toEqual({
      ...nav.navigation.state.params,
      canEditChallenges: true,
      challenge,
      acceptedChallenge: joinedChallenge,
      myId,
      analyticsPermissionType: 'admin',
    });
  });

  it('should provide necessary props for Owner', () => {
    // @ts-ignore
    orgPermissionSelector.mockReturnValue({
      ...orgPermission,
      permission_id: ORG_PERMISSIONS.OWNER,
    });

    expect(mapStateToProps(store, nav)).toEqual({
      ...nav.navigation.state.params,
      canEditChallenges: true,
      challenge,
      acceptedChallenge: joinedChallenge,
      myId,
      analyticsPermissionType: 'owner',
    });
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

it('should render without edit correctly', () => {
  testSnapshotShallow(<ChallengeDetailScreen {...noEditProps} />);
  expect(getChallenge).toHaveBeenCalledWith(challengeId);
});

it('should call joinChallenge from press', () => {
  const component = renderShallow(
    <ChallengeDetailScreen {...unjoinedProps} />,
    // @ts-ignore
    store,
  );
  component
    .find('Header')
    .props()
    // @ts-ignore
    .right.props.onPress();

  expect(joinChallenge).toHaveBeenCalledWith(challenge, orgId);
});

it('should call completeChallenge from press', () => {
  const component = renderShallow(
    <ChallengeDetailScreen {...joinedProps} />,
    // @ts-ignore
    store,
  );
  component
    .find('Header')
    .props()
    // @ts-ignore
    .right.props.onPress();

  expect(completeChallenge).toHaveBeenCalledWith(
    joinedProps.acceptedChallenge,
    orgId,
  );
});

it('should not call completeChallenge with no accepted challenge', () => {
  const component = renderShallow(
    <ChallengeDetailScreen
      {...joinedProps}
      // @ts-ignore
      challenge={{ ...challenge, accepted_community_challenges: undefined }}
    />,
    // @ts-ignore
    store,
  );
  component
    .find('Header')
    .props()
    // @ts-ignore
    .right.props.onPress();

  expect(completeChallenge).not.toHaveBeenCalled();
});

it('should navigate to edit screen from press', () => {
  const component = renderShallow(
    <ChallengeDetailScreen {...joinedProps} />,
    // @ts-ignore
    store,
  );
  // @ts-ignore
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
    // @ts-ignore
    store,
  );
  // @ts-ignore
  component.instance().editChallenge(challenge);

  expect(updateChallenge).toHaveBeenCalledWith(challenge, orgId);
});

it('should call navigateBack from press', () => {
  const component = renderShallow(
    // @ts-ignore
    <ChallengeDetailScreen {...joinedProps} dispatch={jest.fn()} />,
    // @ts-ignore
    store,
  );
  component
    .find('Header')
    .props()
    // @ts-ignore
    .left.props.onPress();

  expect(navigateBack).toHaveBeenCalled();
});

it('should render tabs correctly', () => {
  expect(CHALLENGE_DETAIL_TABS).toMatchSnapshot();
});
