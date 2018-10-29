import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';

import StepsList from '..';

import { testSnapshot } from '../../../../testUtils';

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
