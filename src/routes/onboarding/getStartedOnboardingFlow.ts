import { createStackNavigator } from 'react-navigation';

import { buildTrackedScreen, wrapNextAction, wrapNextScreen } from '../helpers';
import { navigatePush, navigateToMainTabs } from '../../actions/navigation';
import { buildTrackingObj } from '../../utils/common';
import WelcomeScreen, { WELCOME_SCREEN } from '../../containers/WelcomeScreen';
import SetupScreen, { SETUP_SCREEN } from '../../containers/SetupScreen';
import GetStartedScreen, {
  GET_STARTED_SCREEN,
} from '../../containers/GetStartedScreen';
import StageScreen, { STAGE_SCREEN } from '../../containers/StageScreen';
import StageSuccessScreen, {
  STAGE_SUCCESS_SCREEN,
} from '../../containers/StageSuccessScreen';
import SelectMyStepScreen, {
  SELECT_MY_STEP_SCREEN,
} from '../../containers/SelectMyStepScreen';
import AddSomeoneScreen, {
  ADD_SOMEONE_SCREEN,
} from '../../containers/AddSomeoneScreen';
import SetupPersonScreen, {
  SETUP_PERSON_SCREEN,
} from '../../containers/SetupPersonScreen';
import PersonStageScreen, {
  PERSON_STAGE_SCREEN,
} from '../../containers/PersonStageScreen';
import PersonSelectStepScreen, {
  PERSON_SELECT_STEP_SCREEN,
} from '../../containers/PersonSelectStepScreen';
import NotificationPrimerScreen, {
  NOTIFICATION_PRIMER_SCREEN,
} from '../../containers/NotificationPrimerScreen';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../../containers/CelebrationScreen';

export const GetStartedOnboardingFlowScreens = {
  [ADD_SOMEONE_SCREEN]: buildTrackedScreen(
    wrapNextScreen(AddSomeoneScreen, SETUP_PERSON_SCREEN),
    buildTrackingObj('onboarding : add person', 'onboarding', 'add person'),
  ),
  [SETUP_PERSON_SCREEN]: buildTrackedScreen(
    wrapNextAction(SetupPersonScreen, ({}) => dispatch => {
      dispatch(
        navigatePush(PERSON_STAGE_SCREEN, {
          section: 'onboarding',
          subsection: 'add person',
        }),
      );
    }),
    buildTrackingObj(
      'onboarding : add person : name',
      'onboarding',
      'add person',
    ),
  ),
  [PERSON_STAGE_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      PersonStageScreen,
      ({ stage, contactId, name, orgId }) => dispatch => {
        dispatch(
          navigatePush(PERSON_SELECT_STEP_SCREEN, {
            contactStage: stage,
            createStepTracking: buildTrackingObj(
              'onboarding : add person : steps : create',
              'onboarding',
              'add person',
              'steps',
            ),
            contactName: name,
            contactId,
            organization: { id: orgId },
            trackingObj: buildTrackingObj(
              'onboarding : add person : steps : add',
              'onboarding',
              'add person',
              'steps',
            ),
            next: this.handleNavigate,
          }),
        );
      },
    ),
    buildTrackingObj('onboarding : name', 'onboarding'),
  ),
  [PERSON_SELECT_STEP_SCREEN]: buildTrackedScreen(
    wrapNextScreen(PersonSelectStepScreen, CELEBRATION_SCREEN),
    buildTrackingObj('onboarding : name', 'onboarding'),
  ),
  [CELEBRATION_SCREEN]: buildTrackedScreen(
    wrapNextAction(CelebrationScreen, () => dispatch => {
      dispatch(navigateToMainTabs());
    }),
    buildTrackingObj(
      'communities : celebration : comment',
      'communities',
      'celebration',
    ),
  ),
};
export const GetStartedOnboardingFlowNavigator = createStackNavigator(
  GetStartedOnboardingFlowScreens,
  {
    defaultNavigationOptions: {
      header: null,
      gesturesEnabled: true,
    },
  },
);
