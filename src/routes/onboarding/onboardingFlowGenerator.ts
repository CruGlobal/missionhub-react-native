import { navigatePush } from '../../actions/navigation';
import { buildTrackedScreen, wrapNextAction } from '../helpers';
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

const onboardingStartScreens = [];

export const authFlowGenerator = ({
  startScreen = WELCOME_SCREEN,
}: {
  startScreen: WELCOME_SCREEN | GET_STARTED_SCREEN | ADD_SOMEONE_SCREEN;
}) => ({
  ...(startScreen === WELCOME_SCREEN
    ? {
        [WELCOME_SCREEN]: buildTrackedScreen(
          wrapNextScreen(WelcomeScreen, SETUP_SCREEN),
          buildTrackingObj('onboarding : welcome', 'onboarding'),
        ),
        [SETUP_SCREEN]: buildTrackedScreen(
          wrapNextScreen(SetupScreen, GET_STARTED_SCREEN),
          buildTrackingObj('onboarding : name', 'onboarding'),
        ),
      }
    : {}),
  ...(startScreen === WELCOME_SCREEN || startScreen === GET_STARTED_SCREEN
    ? {
        [GET_STARTED_SCREEN]: buildTrackedScreen(
          wrapNextAction(GetStartedScreen, () => dispatch => {
            dispatch(
              navigatePush(STAGE_SCREEN, {
                section: 'onboarding',
                subsection: 'self',
                enableBackButton: false,
              }),
            );
          }),
          buildTrackingObj('onboarding : get started', 'onboarding'),
        ),
        [STAGE_SCREEN]: buildTrackedScreen(
          wrapNextScreen(StageScreen, STAGE_SUCCESS_SCREEN),
          buildTrackingObj('onboarding : name', 'onboarding'),
        ),
        [STAGE_SUCCESS_SCREEN]: buildTrackedScreen(
          wrapNextAction(StageSuccessScreen, ({ stage }) => dispatch => {
            dispatch(
              navigatePush(SELECT_MY_STEP_SCREEN, {
                onboarding: true,
                stage,
                enableBackButton: false,
              }),
            );
          }),
          buildTrackingObj(
            'onboarding : self : choose my steps',
            'onboarding',
            'self',
          ),
        ),
        [SELECT_MY_STEP_SCREEN]: buildTrackedScreen(
          wrapNextScreen(SelectMyStepScreen, ADD_SOMEONE_SCREEN),
          buildTrackingObj(
            'people : self : steps : add',
            'people',
            'self',
            'steps',
          ),
        ),
      }
    : {}),
});
