import { AddPersonStepFlowScreens } from '../addPersonStepFlow';
import PersonSelectStepScreen, {
  PERSON_SELECT_STEP_SCREEN,
} from '../../../containers/PersonSelectStepScreen';
import { selectStepFlowGenerator } from '../selectStepFlowGenerator';

jest.mock('../selectStepFlowGenerator', () => ({
  selectStepFlowGenerator: jest.fn(() => ({ dog: 'roge' })),
}));

it('creates flow with person step screens', () => {
  expect(selectStepFlowGenerator).toHaveBeenCalledWith(
    PERSON_SELECT_STEP_SCREEN,
    PersonSelectStepScreen,
  );
  expect(AddPersonStepFlowScreens).toEqual({ dog: 'roge' });
});
