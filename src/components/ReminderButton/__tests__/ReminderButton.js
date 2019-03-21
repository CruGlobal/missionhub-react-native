import React from 'react';

import { renderShallow, createMockStore } from '../../../../testUtils/index';
import { navigatePush } from '../../../actions/navigation';
import { STEP_REMINDER_SCREEN } from '../../../containers/StepReminderScreen';

import ReminderButton from '..';

jest.mock('../../../actions/navigation');

const stepId = '1';

const store = createMockStore();
let component;

beforeEach(() => {
  component = renderShallow(<ReminderButton stepId={stepId} />, store);
});

it('renders correctly', () => {
  expect(component).toMatchSnapshot();
});

describe('handlePressAndroid', () => {
  beforeEach(() => {
    component.props().onPressAndroid();
  });

  it('navigates to step reminder screen', () => {
    expect(navigatePush).toHaveBeenCalledWith(STEP_REMINDER_SCREEN, { stepId });
  });
});
