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

const next = jest.fn();

const navigateBackResult = { type: 'navigate back' };

beforeEach(() => {
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
  next.mockReturnValue({ type: 'next' });
});

it('renders correctly', () => {
  renderWithContext(<StageSuccessScreen next={next} />).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(
    ['onboarding', 'stage confirmation'],
    { sectionType: true },
  );
});

it('calls next with selected stage', () => {
  const { getByTestId } = renderWithContext(<StageSuccessScreen next={next} />);
  fireEvent(getByTestId('IconMessageScreen'), 'onComplete');
  expect(next).toHaveBeenCalledWith();
});

it('calls navigate back', () => {
  const { getByTestId } = renderWithContext(<StageSuccessScreen next={next} />);
  fireEvent(getByTestId('IconMessageScreen'), 'onBack');
  expect(navigateBack).toHaveBeenCalledWith();
});
