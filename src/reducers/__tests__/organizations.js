import organizations from '../organizations';
import { REQUESTS } from '../../actions/api';
import {
  LOAD_ORGANIZATIONS,
  GET_ORGANIZATIONS_CONTACTS_REPORT,
  GET_ORGANIZATION_SURVEYS,
  GET_ORGANIZATION_MEMBERS,
  DEFAULT_PAGE_LIMIT,
  UPDATE_PERSON_ATTRIBUTES,
  REMOVE_ORGANIZATION_MEMBER,
  LOAD_PERSON_DETAILS,
  UPDATE_CHALLENGE,
  GLOBAL_COMMUNITY_ID,
} from '../../constants';

const org1Id = '123';
const org2Id = '234';
const initialState = {
  all: [{ id: org1Id, name: 'test org 1' }, { id: org2Id, name: 'test org 2' }],
};

const reports = [
  {
    id: org1Id,
    contactsCount: 12,
    unassignedCount: 10,
    uncontactedCount: 10,
  },
  {
    id: org2Id,
    contactsCount: 23,
    unassignedCount: 10,
    uncontactedCount: 14,
  },
];

it('should save loaded orgs', () => {
  expect(
    organizations(undefined, {
      type: LOAD_ORGANIZATIONS,
      orgs: [{ id: org1Id }, { id: org2Id }],
    }),
  ).toMatchSnapshot();
});

it('should load contact reports for all organizations', () => {
  const state = organizations(initialState, {
    type: GET_ORGANIZATIONS_CONTACTS_REPORT,
    reports,
  });

  expect(state).toMatchSnapshot();
});

it('loads surveys for org with paging', () => {
  const orgId = '1';
  const oldSurveys = [
    { id: '0', title: 'Title 0' },
    { id: '1', title: 'Title 1' },
    { id: '2', title: 'Title 2' },
    { id: '3', title: 'Title 3' },
    { id: '4', title: 'Title 4' },
    { id: '5', title: 'Title 5' },
    { id: '6', title: 'Title 6' },
    { id: '7', title: 'Title 7' },
    { id: '8', title: 'Title 8' },
    { id: '9', title: 'Title 9' },
    { id: '10', title: 'Title 10' },
    { id: '11', title: 'Title 11' },
    { id: '12', title: 'Title 12' },
    { id: '13', title: 'Title 13' },
    { id: '14', title: 'Title 14' },
    { id: '15', title: 'Title 15' },
    { id: '16', title: 'Title 16' },
    { id: '17', title: 'Title 17' },
    { id: '18', title: 'Title 18' },
    { id: '19', title: 'Title 19' },
    { id: '20', title: 'Title 20' },
    { id: '21', title: 'Title 21' },
    { id: '22', title: 'Title 22' },
    { id: '23', title: 'Title 23' },
    { id: '24', title: 'Title 24' },
  ];
  const newSurveys = [
    { id: '25', title: 'Title 25' },
    { id: '26', title: 'Title 26' },
    { id: '27', title: 'Title 27' },
  ];
  const oldOrg = { id: orgId, surveys: oldSurveys };

  const state = organizations(
    {
      all: [oldOrg],
      surveysPagination: {
        hasNextPage: true,
        page: 1,
      },
    },
    {
      type: GET_ORGANIZATION_SURVEYS,
      orgId: orgId,
      query: {
        page: {
          limit: DEFAULT_PAGE_LIMIT,
          offset: DEFAULT_PAGE_LIMIT,
        },
        organization_id: orgId,
      },
      meta: {
        total: 28,
      },
      surveys: newSurveys,
    },
  );

  expect(state.surveysPagination).toEqual({ hasNextPage: false, page: 2 });
  expect(state.all.find(o => o.id === orgId)).toEqual({
    ...oldOrg,
    surveys: [...oldSurveys, ...newSurveys],
  });
});

describe('REQUESTS.GET_GROUP_CELEBRATE_FEED.SUCCESS', () => {
  const orgId = '1';

  it('loads celebrate items with pagination', () => {
    const oldItems = [
      { id: '0', title: 'Title 0' },
      { id: '1', title: 'Title 1' },
      { id: '2', title: 'Title 2' },
      { id: '3', title: 'Title 3' },
      { id: '4', title: 'Title 4' },
      { id: '5', title: 'Title 5' },
      { id: '6', title: 'Title 6' },
      { id: '7', title: 'Title 7' },
      { id: '8', title: 'Title 8' },
      { id: '9', title: 'Title 9' },
      { id: '10', title: 'Title 10' },
      { id: '11', title: 'Title 11' },
      { id: '12', title: 'Title 12' },
      { id: '13', title: 'Title 13' },
      { id: '14', title: 'Title 14' },
      { id: '15', title: 'Title 15' },
      { id: '16', title: 'Title 16' },
      { id: '17', title: 'Title 17' },
      { id: '18', title: 'Title 18' },
      { id: '19', title: 'Title 19' },
      { id: '20', title: 'Title 20' },
      { id: '21', title: 'Title 21' },
      { id: '22', title: 'Title 22' },
      { id: '23', title: 'Title 23' },
      { id: '24', title: 'Title 24' },
    ];
    const newItems = [
      { id: '25', title: 'Title 25' },
      { id: '26', title: 'Title 26' },
      { id: '27', title: 'Title 27' },
    ];

    const state = organizations(
      {
        all: [
          {
            id: orgId,
            celebrateItems: oldItems,
            celebratePagination: {
              hasNextPage: true,
              page: 1,
            },
          },
        ],
      },
      {
        type: REQUESTS.GET_GROUP_CELEBRATE_FEED.SUCCESS,
        orgId: orgId,
        query: {
          page: {
            limit: DEFAULT_PAGE_LIMIT,
            offset: DEFAULT_PAGE_LIMIT,
          },
          orgId,
        },
        meta: {
          total: 28,
        },
        results: {
          response: newItems,
        },
      },
    );

    expect(state.all[0].celebratePagination).toEqual({
      hasNextPage: false,
      page: 2,
    });
  });

  it('should do nothing if query page is less than current page', () => {
    const state = organizations(
      {
        all: [
          {
            id: orgId,
            celebrateItems: [],
            celebratePagination: {
              hasNextPage: true,
              page: 3,
            },
          },
        ],
      },
      {
        type: REQUESTS.GET_GROUP_CELEBRATE_FEED.SUCCESS,
        orgId: orgId,
        query: {
          page: {
            limit: DEFAULT_PAGE_LIMIT,
            offset: DEFAULT_PAGE_LIMIT * 2,
          },
          orgId,
        },
        meta: {
          total: 28,
        },
        results: {
          response: [{ id: '234252523' }],
        },
      },
    );

    expect(state.all[0].celebrateItems).toEqual([]);
  });
});

it('updates celebrate item from unliked to liked', () => {
  const orgId = '1';
  const eventId = '3';
  const likes = 0;

  const startItems = [
    { id: eventId, liked: false, likes_count: likes },
    { id: '123', liked: false, likes_count: '1' },
  ];
  const resultItems = [
    { id: eventId, liked: true, likes_count: likes + 1 },
    { id: '123', liked: false, likes_count: '1' },
  ];

  const state = organizations(
    {
      all: [
        {
          id: orgId,
          celebrateItems: startItems,
        },
      ],
    },
    {
      type: REQUESTS.LIKE_CELEBRATE_ITEM.SUCCESS,
      query: {
        orgId,
        eventId,
      },
    },
  );

  expect(state).toEqual({
    all: [
      {
        id: orgId,
        celebrateItems: resultItems,
      },
    ],
  });
});

it('updates celebrate item from liked to unliked', () => {
  const orgId = '1';
  const eventId = '3';
  const likes = 3;
  const startItems = [
    { id: eventId, liked: true, likes_count: likes },
    { id: '123', liked: false, likes_count: '1' },
  ];
  const resultItems = [
    { id: eventId, liked: false, likes_count: likes - 1 },
    { id: '123', liked: false, likes_count: '1' },
  ];

  const state = organizations(
    {
      all: [
        {
          id: orgId,
          celebrateItems: startItems,
        },
      ],
    },
    {
      type: REQUESTS.UNLIKE_CELEBRATE_ITEM.SUCCESS,
      query: {
        orgId,
        eventId,
      },
    },
  );

  expect(state).toEqual({
    all: [
      {
        id: orgId,
        celebrateItems: resultItems,
      },
    ],
  });
});

it('loads members for org with paging', () => {
  const orgId = '1';
  const oldMembers = [
    {
      id: '0',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '1',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '2',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '3',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '4',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '5',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '6',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '7',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '8',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '9',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '10',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '11',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '12',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '13',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '14',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '15',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '16',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '17',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '18',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '19',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '20',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '21',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '22',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '23',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '24',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
  ];
  const newMembers = [
    {
      id: '25',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '26',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      id: '27',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
  ];

  const state = organizations(
    {
      all: [
        {
          id: orgId,
          members: oldMembers,
        },
      ],
      membersPagination: {
        hasNextPage: true,
        page: 1,
      },
    },
    {
      type: GET_ORGANIZATION_MEMBERS,
      orgId: orgId,
      query: {
        page: {
          limit: DEFAULT_PAGE_LIMIT,
          offset: DEFAULT_PAGE_LIMIT,
        },
        organization_id: orgId,
        filters: {
          permissions: 'owner,admin,user',
        },
        include: 'contact_assignments,organizational_permissions',
      },
      meta: {
        total: 28,
      },
      members: newMembers,
    },
  );

  expect(state.membersPagination).toEqual({ hasNextPage: false, page: 2 });
});

describe('REQUESTS.GET_GROUP_CHALLENGE_FEED.SUCCESS', () => {
  const orgId = '1';

  it('loads challenge items with pagination', () => {
    const oldItems = [
      { id: '0', title: 'Title 0' },
      { id: '1', title: 'Title 1' },
      { id: '2', title: 'Title 2' },
      { id: '3', title: 'Title 3' },
      { id: '4', title: 'Title 4' },
      { id: '5', title: 'Title 5' },
      { id: '6', title: 'Title 6' },
      { id: '7', title: 'Title 7' },
      { id: '8', title: 'Title 8' },
      { id: '9', title: 'Title 9' },
      { id: '10', title: 'Title 10' },
      { id: '11', title: 'Title 11' },
      { id: '12', title: 'Title 12' },
      { id: '13', title: 'Title 13' },
      { id: '14', title: 'Title 14' },
      { id: '15', title: 'Title 15' },
      { id: '16', title: 'Title 16' },
      { id: '17', title: 'Title 17' },
      { id: '18', title: 'Title 18' },
      { id: '19', title: 'Title 19' },
      { id: '20', title: 'Title 20' },
      { id: '21', title: 'Title 21' },
      { id: '22', title: 'Title 22' },
      { id: '23', title: 'Title 23' },
      { id: '24', title: 'Title 24' },
    ];
    const newItems = [
      { id: '25', title: 'Title 25' },
      { id: '26', title: 'Title 26' },
      { id: '27', title: 'Title 27' },
    ];

    const state = organizations(
      {
        all: [
          {
            id: orgId,
            challengeItems: oldItems,
            challengePagination: {
              hasNextPage: true,
              page: 1,
            },
          },
        ],
      },
      {
        type: REQUESTS.GET_GROUP_CHALLENGE_FEED.SUCCESS,
        query: {
          filters: { organization_ids: orgId },
          page: {
            limit: DEFAULT_PAGE_LIMIT,
            offset: DEFAULT_PAGE_LIMIT,
          },
        },
        meta: {
          total: 28,
        },
        results: {
          response: newItems,
        },
      },
    );

    expect(state.all[0].challengePagination).toEqual({
      hasNextPage: false,
      page: 2,
    });
  });

  it('should do nothing if query page is less than current page', () => {
    const state = organizations(
      {
        all: [
          {
            id: orgId,
            challengeItems: [],
            challengePagination: {
              hasNextPage: true,
              page: 3,
            },
          },
        ],
      },
      {
        type: REQUESTS.GET_GROUP_CHALLENGE_FEED.SUCCESS,
        query: {
          filters: { organization_ids: orgId },
          page: {
            limit: DEFAULT_PAGE_LIMIT,
            offset: DEFAULT_PAGE_LIMIT * 2,
          },
        },
        meta: {
          total: 28,
        },
        results: {
          response: [{ id: '234252523' }],
        },
      },
    );

    expect(state.all[0].challengeItems).toEqual([]);
  });
});

describe('update organization in line', () => {
  const orgId = '1';
  const org = {
    id: orgId,
    name: 'old name',
    community_photo_url: 'old photo url',
    community_code: 'old code',
  };
  it('updates the organization name', () => {
    const name = 'new name';
    const state = organizations(
      { all: [org] },
      {
        type: REQUESTS.UPDATE_ORGANIZATION.SUCCESS,
        results: {
          response: { ...org, name },
        },
      },
    );

    expect(state.all[0].name).toEqual(name);
  });
  it('updates the organization photo url', () => {
    const community_photo_url = 'new photo url';
    const state = organizations(
      { all: [org] },
      {
        type: REQUESTS.UPDATE_ORGANIZATION_IMAGE.SUCCESS,
        results: {
          response: { ...org, community_photo_url },
        },
      },
    );

    expect(state.all[0].community_photo_url).toEqual(community_photo_url);
  });
  it('updates the organization code', () => {
    const community_code = 'new code';
    const state = organizations(
      { all: [org] },
      {
        type: REQUESTS.ORGANIZATION_NEW_CODE.SUCCESS,
        results: {
          response: { ...org, community_code },
        },
      },
    );

    expect(state.all[0].community_code).toEqual(community_code);
  });
  it('updates the organization url', () => {
    const community_url = 'new url';
    const state = organizations(
      { all: [org] },
      {
        type: REQUESTS.ORGANIZATION_NEW_LINK.SUCCESS,
        results: {
          response: { ...org, community_url },
        },
      },
    );

    expect(state.all[0].community_url).toEqual(community_url);
  });
});

describe('UPDATE_PERSON_ATTRIBUTES', () => {
  it('should update attributes of a member in all orgs ', () => {
    const orgPermission1 = { id: '7777', permission_id: '1' };
    const orgPermission2 = { id: '8888', permission_id: '1' };
    const orgPermission3 = { id: '9999', permission_id: '1' };
    const orgPermission1New = { ...orgPermission1, permission_id: '2' };

    const person1 = {
      id: '111',
      organizational_permissions: [orgPermission1, orgPermission2],
    };
    const person2 = {
      id: '222',
      organizational_permissions: [orgPermission3],
    };
    const person1New = {
      ...person1,
      organizational_permissions: [orgPermission1New, orgPermission2],
    };

    const state = organizations(
      {
        all: [
          {
            id: org1Id,
            members: [person1, person2],
          },
          {
            id: org2Id,
            members: [person1],
          },
        ],
      },
      {
        type: UPDATE_PERSON_ATTRIBUTES,
        updatedPersonAttributes: {
          id: person1.id,
          organizational_permissions: [orgPermission1New, orgPermission2],
        },
      },
    );

    expect(state.all).toEqual([
      {
        id: org1Id,
        members: [person1New, person2],
      },
      {
        id: org2Id,
        members: [person1New],
      },
    ]);
  });
});

describe('LOAD_PERSON_DETAILS', () => {
  it('should update attributes of a member in all orgs ', () => {
    const orgPermission1 = { id: '7777', permission_id: '1' };
    const orgPermission2 = { id: '8888', permission_id: '1' };
    const orgPermission3 = { id: '9999', permission_id: '1' };
    const orgPermission1New = { ...orgPermission1, permission_id: '2' };

    const person1 = {
      id: '111',
      organizational_permissions: [orgPermission1, orgPermission2],
    };
    const person2 = {
      id: '222',
      organizational_permissions: [orgPermission3],
    };
    const person1New = {
      ...person1,
      organizational_permissions: [orgPermission1New, orgPermission2],
    };

    const state = organizations(
      {
        all: [
          {
            id: org1Id,
            members: [person1, person2],
          },
          {
            id: org2Id,
            members: [person1],
          },
        ],
      },
      {
        type: LOAD_PERSON_DETAILS,
        person: {
          id: person1.id,
          organizational_permissions: [orgPermission1New, orgPermission2],
        },
      },
    );

    expect(state.all).toEqual([
      {
        id: org1Id,
        members: [person1New, person2],
      },
      {
        id: org2Id,
        members: [person1New],
      },
    ]);
  });
});

describe('REQUESTS.GET_ME', () => {
  it('should update attributes of a member in all orgs ', () => {
    const orgPermission1 = { id: '7777', permission_id: '1' };
    const orgPermission2 = { id: '8888', permission_id: '1' };
    const orgPermission3 = { id: '9999', permission_id: '1' };
    const orgPermission1New = { ...orgPermission1, permission_id: '2' };

    const person1 = {
      id: '111',
      organizational_permissions: [orgPermission1, orgPermission2],
    };
    const person2 = {
      id: '222',
      organizational_permissions: [orgPermission3],
    };
    const person1New = {
      ...person1,
      organizational_permissions: [orgPermission1New, orgPermission2],
    };

    const state = organizations(
      {
        all: [
          {
            id: org1Id,
            members: [person1, person2],
          },
          {
            id: org2Id,
            members: [person1],
          },
        ],
      },
      {
        type: REQUESTS.GET_ME.SUCCESS,
        results: {
          response: {
            id: person1.id,
            organizational_permissions: [orgPermission1New, orgPermission2],
          },
        },
      },
    );

    expect(state.all).toEqual([
      {
        id: org1Id,
        members: [person1New, person2],
      },
      {
        id: org2Id,
        members: [person1New],
      },
    ]);
  });
});

describe('REMOVE_ORGANIZATION_MEMBER', () => {
  it('should remove member', () => {
    const personId = '2542342';
    const orgId = '980789879';
    const otherPerson = { id: '42324' };
    const initialState = {
      all: [
        {
          id: '1',
          members: [{ id: personId }],
        },
        {
          id: orgId,
          members: [otherPerson, { id: personId }],
        },
      ],
    };

    const result = organizations(initialState, {
      type: REMOVE_ORGANIZATION_MEMBER,
      personId,
      orgId,
    });

    expect(result).toEqual({
      all: [
        {
          id: '1',
          members: [{ id: personId }],
        },
        {
          id: orgId,
          members: [otherPerson],
        },
      ],
    });
  });
});

describe('UPDATE_CHALLENGE', () => {
  const orgId = '111';
  const organization = { id: orgId };
  const challenge_id = '1';

  const challengeOld = {
    id: challenge_id,
    organization,
    created_at: '01-11-2018',
    accepted_at: null,
  };
  const challengeNew = {
    id: challenge_id,
    organization,
    accepted_at: '31-11-2018',
    completed_at: '01-12-2018',
  };
  const challengeResult = {
    id: challenge_id,
    organization,
    created_at: challengeOld.created_at,
    accepted_at: challengeNew.accepted_at,
    completed_at: challengeNew.completed_at,
  };

  const state = organizations(
    {
      all: [
        {
          id: orgId,
          challengeItems: [challengeOld],
        },
      ],
    },
    {
      type: UPDATE_CHALLENGE,
      challenge: challengeNew,
    },
  );

  expect(state.all[0].challengeItems).toEqual([challengeResult]);
});

describe('GET_USERS_REPORT.SUCCESS', () => {
  it('adds users count to global org', () => {
    expect(
      organizations(
        {
          all: [
            {
              id: GLOBAL_COMMUNITY_ID,
              name: 'MissionHub Community',
              community: true,
              user_created: true,
              contactReport: {
                some_prop: 'Roge',
              },
            },
            { id: '1', name: "Roger's community" },
          ],
        },
        {
          type: REQUESTS.GET_USERS_REPORT.SUCCESS,
          results: {
            response: {
              users_count: 100000,
            },
          },
        },
      ),
    ).toMatchSnapshot();
  });
});
