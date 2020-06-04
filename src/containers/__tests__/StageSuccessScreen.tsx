import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { navigateBack } from '../../actions/navigation';
import StageSuccessScreen from '../StageSuccessScreen';
import { renderWithContext } from '../../../testUtils';
import { useAnalytics } from '../../utils/hooks/useAnalytics';

jest.mock('react-native-device-info');
jest.mock('../../actions/navigation');
jest.mock('../../utils/hooks/useAnalytics');

const initialState = {
  auth: {
    person: { first_name: 'Test Fname', user: { pathway_stage_id: '1' } },
  },
  stages: {
    stages: [
      {
        id: '1',
        self_followup_description: 'We are glad you are here, <<user>>!',
      },
    ],
  },
  onboarding: { currentlyOnboarding: true },
};

const next = jest.fn();

const navigateBackResult = { type: 'navigate back' };

beforeEach(() => {
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
  next.mockReturnValue({ type: 'next' });
});

it('renders correctly', () => {
  renderWithContext(<StageSuccessScreen next={next} />, {
    initialState,
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(
    ['onboarding', 'stage confirmation'],
    {},
    { includeSectionType: true },
  );
});

it('calls next with selected stage', () => {
  const { getByTestId } = renderWithContext(
    <StageSuccessScreen next={next} />,
    {
      initialState,
    },
  );
  fireEvent(getByTestId('IconMessageScreen'), 'onComplete');
  expect(next).toHaveBeenCalledWith();
});

it('calls navigate back', () => {
  const { getByTestId } = renderWithContext(
    <StageSuccessScreen next={next} />,
    {
      initialState,
    },
  );
  fireEvent(getByTestId('IconMessageScreen'), 'onBack');
  expect(navigateBack).toHaveBeenCalledWith();
});
