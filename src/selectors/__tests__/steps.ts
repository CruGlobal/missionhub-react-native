import { Step, StepsState } from '../../reducers/steps';
import { myStepsSelector } from '../steps';

const mySteps = [
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
] as Step[];

const steps = ({
  mine: mySteps,
} as unknown) as StepsState;

describe('hasReminderStepsSelector', () => {
  it('should return my steps', () => {
    expect(myStepsSelector({ steps })).toEqual(mySteps);
  });

  it('should return my steps and filter out steps with no receiver', () => {
    const noReceiverStep = { id: '7', receiver: {} } as Step;

    expect(
      myStepsSelector({
        steps: {
          ...steps,
          mine: [...mySteps, noReceiverStep],
        },
      }),
    ).toEqual(mySteps);
  });
});
