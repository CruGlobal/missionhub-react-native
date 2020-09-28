import { GET_STARTED_SCREEN } from '../../../containers/GetStartedScreen/constants';
import { onboardingFlowGenerator } from '../onboardingFlowGenerator';

jest.mock('../onboardingFlowGenerator', () => ({
  onboardingFlowGenerator: jest.fn(() => 'someScreens'),
}));

it('should delegate to onboardingFlowGenerator', () => {
  expect(
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('../getStartedOnboardingFlow').GetStartedOnboardingFlowScreens,
  ).toEqual('someScreens');

  expect(onboardingFlowGenerator).toHaveBeenCalledWith({
    startScreen: GET_STARTED_SCREEN,
  });
});
