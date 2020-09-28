import { authFlowGenerator } from '../../auth/authFlowGenerator';
import { navigateNestedReset } from '../../../actions/navigation';
import { SIGNUP_TYPES } from '../../../containers/Auth/SignUpScreen';
import { MAIN_TABS, COMMUNITIES_TAB } from '../../../constants';
import { CREATE_GROUP_SCREEN } from '../../../containers/Groups/CreateGroupScreen';

jest.mock('react-navigation-stack');
jest.mock('../../auth/authFlowGenerator');
jest.mock('../../../actions/navigation');
const navigateNestedResetResult = {
  type: 'navigateNestedReset',
};
(navigateNestedReset as jest.Mock).mockReturnValue(navigateNestedResetResult);

it('should have called authFlowGenerator', () => {
  require('../createCommunityUnauthenticatedFlow');
  expect(authFlowGenerator).toHaveBeenCalledWith({
    completeAction: navigateNestedResetResult,
    includeSignUp: true,
    // @ts-ignore
    signUpType: SIGNUP_TYPES.CREATE_COMMUNITY,
  });
  expect(navigateNestedReset).toHaveBeenCalledWith([
    {
      routeName: MAIN_TABS,
      tabName: COMMUNITIES_TAB,
    },
    { routeName: CREATE_GROUP_SCREEN },
  ]);
});
