import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';

// Note: test renderer must be required after react-native.
import StepsList from '../../src/components/StepsList';
import { testSnapshot } from '../../testUtils';

const items = [
  { id: '1', body: 'I feel great', selected: true },
  { id: '2', body: 'I feel wonderful', selected: false },
];
const props = {
  items,
  createStepText: 'Create your own step...',
  loadMoreStepsText: 'load more steps',
  onSelectStep: jest.fn(),
  onCreateStep: jest.fn(),
  onLoadMoreSteps: jest.fn(),
};
const createComponent = props => shallow(<StepsList {...props} />);

it('renders correctly', () => {
  testSnapshot(<StepsList {...props} />);
});

describe('arrow functions', () => {
  it('should select step', () => {
    const instance = createComponent(props).instance();
    instance.selectStep(items[0]);
    expect(props.onSelectStep).toHaveBeenCalledWith(items[0]);
  });
});
