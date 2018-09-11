import { challengesSelector } from '../../src/selectors/challenges';

const organization = { id: '123' };
const challengeItems = [
  {
    id: '1',
    creator_id: 'person1',
    organization_id: organization.id,
    title: 'Read "There and Back Again"',
    end_date: '2018-09-06T14:13:21Z',
    accepted: 5,
    completed: 3,
    days_remaining: 14,
  },
  {
    id: '2',
    creator_id: 'person2',
    organization_id: organization.id,
    title: 'Invite a neighbor over for mince pie.',
    end_date: '2018-09-06T14:13:21Z',
    accepted: 5,
    completed: 3,
    days_remaining: 14,
    accepted_at: '2018-09-06T14:13:21Z',
  },
  {
    id: '3',
    creator_id: 'person3',
    organization_id: organization.id,
    title: 'Invite Smeagol over for fresh fish',
    end_date: '2018-09-06T14:13:21Z',
    accepted: 5,
    completed: 0,
    days_remaining: 0,
    total_days: 7,
  },
  {
    id: '4',
    creator_id: 'person4',
    organization_id: organization.id,
    title: 'Who can wear the ring the longest.',
    end_date: '2018-09-06T14:13:21Z',
    accepted: 5,
    completed: 3,
    days_remaining: 0,
    total_days: 7,
    accepted_at: '2018-09-06T14:13:21Z',
    completed_at: '2018-09-06T14:13:21Z',
  },
];

it('sorts items into sections by active or past', () => {
  expect(challengesSelector({ challengeItems })).toMatchSnapshot();
});
