import { migrations } from '../storeMigrations';

it('should migrate impact reducer to use summary key', () => {
  expect(
    migrations[0]({
      auth: {},
      impact: {
        interactions: {
          '123-': {},
        },
        people: {
          '123': 'personImpact1',
          '456': 'personImpact2',
        },
        global: 'globalImpact',
      },
    }),
  ).toMatchSnapshot();
});

it('should migrate swipe groupOnBoarding reducer to use steps', () => {
  expect(
    migrations[1]({
      auth: {},
      impact: {
        interactions: {
          '123': {},
        },
        people: {
          '123': 'personImpact1',
          '456': 'personImpact2',
        },
        global: 'globalImpact',
      },
      swipe: {
        groupOnBoarding: {
          celebrate: true,
          challenges: true,
          members: true,
          impact: true,
          contacts: true,
          surveys: true,
        },
      },
    }),
  ).toMatchSnapshot();
});

it('should migrate onboarding state', () => {
  expect(
    migrations[2]({
      auth: {},
      profile: {
        community: {
          id: '10',
          community_code: 'abc123',
          community_url: 'asdf123asdf',
        },
      },
      personProfile: { id: '1', hasCompletedOnboarding: true },
    }),
  ).toMatchInlineSnapshot(`
    Object {
      "auth": Object {},
      "onboarding": Object {
        "community": Object {
          "community_code": "abc123",
          "community_url": "asdf123asdf",
          "id": "10",
        },
        "personId": "1",
        "skippedAddingPerson": true,
      },
    }
  `);
});
