import {
  reminderStepsSelector,
  nonReminderStepsSelector,
  hasReminderStepsSelector,
} from '../steps';

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
    focus: true,
  },
  {
    id: '2',
    receiver: {
      id: '20',
    },
    focus: true,
  },
  {
    id: '3',
    organization: {
      id: '100',
    },
    receiver: {
      id: '30',
    },
    focus: true,
  },
];

const nonReminders = [
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
];

const steps = {
  mine: [...reminders, ...nonReminders],
};

describe('hasReminderStepsSelector', () => {
  it('should return true if reminder steps exist', () => {
    expect(hasReminderStepsSelector({ steps })).toEqual(true);
  });
  it('should return false if no reminder steps exist', () => {
    expect(
      hasReminderStepsSelector({
        steps: {
          mine: nonReminders,
        },
      }),
    ).toEqual(false);
  });
});

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
