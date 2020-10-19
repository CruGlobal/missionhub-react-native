import { authFlowGenerator } from '../../auth/authFlowGenerator';
import { resetToInitialRoute } from '../../../actions/navigationInit';

jest.mock('react-navigation-stack');
jest.mock('../../auth/authFlowGenerator');
jest.mock('../../../actions/navigationInit');
const resetToInitialRouteResult = {
  type: 'resetToInitialRoute',
};
(resetToInitialRoute as jest.Mock).mockReturnValue(resetToInitialRouteResult);

it('should have called authFlowGenerator', () => {
  require('../signUp');
  expect(authFlowGenerator).toHaveBeenCalledWith({
    completeAction: resetToInitialRouteResult,
    includeSignUp: true,
  });
  expect(resetToInitialRoute).toHaveBeenCalledWith(true);
});
