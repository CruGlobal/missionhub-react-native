import MockDate from 'mockdate';

import { organizationSelector } from '../organizations';
import {
  challengesSelector,
  communityChallengeSelector,
  acceptedChallengesSelector,
} from '../challenges';

jest.mock('../organizations');

const orgId = '123';
const mockDate = '2018-09-15';
MockDate.set(mockDate);

const challengeItems = [
  {
    id: '1',
    creator_id: 'person1',
    organization_id: orgId,
    title: 'Read "There and Back Again"',
    end_date: '2018-09-26T14:13:21Z',
    accepted_count: 5,
    completed_count: 3,
  },
  {
    id: '2',
    creator_id: 'person2',
    organization_id: orgId,
    title: 'Invite a neighbor over for mince pie.',
    end_date: '2018-09-16T14:13:21Z',
    accepted_count: 5,
    completed_count: 3,
    accepted_at: '2018-09-06T14:13:21Z',
  },
  {
    id: '3',
    creator_id: 'person3',
    organization_id: orgId,
    title: 'Invite Smeagol over for fresh fish',
    end_date: '2018-09-06T14:13:21Z',
    accepted_count: 5,
    completed_count: 0,
  },
  {
    id: '4',
    creator_id: 'person4',
    organization_id: orgId,
    title: 'Who can wear the ring the longest.',
    end_date: '2018-09-06T14:13:21Z',
    accepted_count: 5,
    completed_count: 3,
    accepted_at: '2018-09-06T14:13:21Z',
    completed_at: '2018-09-06T14:13:21Z',
  },
];

const currentOnlyItems = [
  {
    id: '1',
    creator_id: 'person1',
    organization_id: orgId,
    title: 'Read "There and Back Again"',
    end_date: '2018-09-26T14:13:21Z',
    accepted_count: 5,
    completed_count: 3,
  },
  {
    id: '2',
    creator_id: 'person2',
    organization_id: orgId,
    title: 'Invite a neighbor over for mince pie.',
    end_date: '2018-09-16T14:13:21Z',
    accepted_count: 5,
    completed_count: 3,
    accepted_at: '2018-09-06T14:13:21Z',
  },
];

const organizations = {
  all: [
    {
      id: orgId,
      challengeItems,
    },
  ],
};

const acceptedChallenges = [
  {
    id: '1',
    accepted_at: '2018-09-06T14:13:21Z',
    completed_at: '2018-09-08T14:13:21Z',
    person: {
      id: '1',
    },
  },
  {
    id: '2',
    accepted_at: '2018-09-06T14:13:21Z',
    completed_at: null,
    person: {
      id: '2',
    },
  },
  {
    id: '3',
    accepted_at: '2018-09-06T14:13:21Z',
    completed_at: '2018-09-08T14:13:21Z',
    person: {
      id: '3',
      _placeHolder: true,
    },
  },
  {
    id: '4',
    accepted_at: '2018-09-06T14:13:21Z',
    completed_at: '2018-09-08T14:13:21Z',
    person: {
      id: '4',
    },
  },
];

describe('challengesSelector', () => {
  it('sorts challenge items into sections by active or past', () => {
    expect(challengesSelector({ challengeItems })).toMatchSnapshot();
  });

  it('hides past challenges section if no past challenges', () => {
    expect(
      challengesSelector({ challengeItems: currentOnlyItems }),
    ).toMatchSnapshot();
  });
});

describe('communityChallengesSelector', () => {
  it('selects single current community challenge', () => {
    organizationSelector.mockReturnValue(organizations.all[0]);

    expect(
      communityChallengeSelector(
        { organizations },
        { orgId, challengeId: challengeItems[0].id },
      ),
    ).toEqual({ ...challengeItems[0], isPast: false });
    expect(organizationSelector).toHaveBeenCalledWith(
      { organizations },
      { orgId },
    );
  });

  it('selects single past community challenge', () => {
    organizationSelector.mockReturnValue(organizations.all[0]);

    expect(
      communityChallengeSelector(
        { organizations },
        { orgId, challengeId: challengeItems[2].id },
      ),
    ).toEqual({ ...challengeItems[2], isPast: true });
    expect(organizationSelector).toHaveBeenCalledWith(
      { organizations },
      { orgId },
    );
  });
});

describe('acceptedChallengesSelector', () => {
  it('sorts accepted challenge items into sections by joined or completed', () => {
    expect(
      acceptedChallengesSelector({ acceptedChallenges }),
    ).toMatchSnapshot();
  });
});
