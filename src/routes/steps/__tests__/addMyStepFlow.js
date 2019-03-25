import { AddMyStepFlowScreens } from '../addMyStepFlow';
import SelectMyStepScreen, {
  SELECT_MY_STEP_SCREEN,
} from '../../../containers/SelectMyStepScreen';
import { selectStepFlowGenerator } from '../selectStepFlowGenerator';

jest.mock('../selectStepFlowGenerator', () => ({
  selectStepFlowGenerator: jest.fn(() => ({ dog: 'roge' })),
}));

it('creates flow with my step screens', () => {
  expect(selectStepFlowGenerator).toHaveBeenCalledWith(
    SELECT_MY_STEP_SCREEN,
    SelectMyStepScreen,
  );
  expect(AddMyStepFlowScreens).toEqual({ dog: 'roge' });
});
