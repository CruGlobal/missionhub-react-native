import { reminderStepsSelector, nonReminderStepsSelector } from '../../src/selectors/steps';

const people = {
  allByOrg: {
    personal: {
      id: 'personal',
      type: 'organization',
      people: {
        '20': {
          id: '20',
          type: 'person',
          first_name: 'Fname2',
          last_name: 'Lname',
        },
      },
    },
    '100': {
      id: '100',
      type: 'organization',
      name: 'Org2',
      people: {
        '30': {
          id: '30',
          type: 'person',
          first_name: 'Fname3',
          last_name: 'Lname2',
        },
      },
    },
  },
};

const reminders = [
  {
    id: '1',
    receiver: {
      id: '20',
    },
    reminder: true,
  },
  {
    id: '2',
    receiver: {
      id: '20',
    },
    reminder: true,
  },
  {
    id: '3',
    organization: {
      id: '100',
    },
    receiver: {
      id: '30',
    },
    reminder: true,
  },
];

const steps = {
  reminders,
  mine: [
    ...reminders,
    {
      id: '4',
      receiver: {
        id: '20',
      },
    },
    {
      id: '5',
      receiver: {
        id: '20',
      },
    },
    {
      id: '6',
      organization: {
        id: '100',
      },
      receiver: {
        id: '30',
      },
    },
  ],
};

describe('reminderStepsSelector', () => {
  it('should get reminder steps', () => {
    expect(reminderStepsSelector({ steps, people })).toMatchSnapshot();
  });
});

describe('nonReminderStepsSelector', () => {
  it('should get non reminder steps', () => {
    expect(nonReminderStepsSelector({ steps, people })).toMatchSnapshot();
  });
});
