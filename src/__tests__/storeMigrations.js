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
