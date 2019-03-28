import { reminderSelector } from '../stepReminders';

const stepId = '3';
const reminder = { id: '33' };

const stepReminders = {
  allByStep: {
    '0': { id: '00' },
    '1': { id: '11' },
    '2': { id: '22' },
    [stepId]: reminder,
  },
};

describe('reminderSelector', () => {
  it('selects reminder by step id', () => {
    expect(reminderSelector({ stepReminders }, { stepId })).toEqual(reminder);
  });
});
