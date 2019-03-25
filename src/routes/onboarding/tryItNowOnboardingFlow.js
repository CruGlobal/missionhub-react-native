import { createStackNavigator } from 'react-navigation';

import { addStep } from '../../actions/steps';
import { buildCustomStep } from '../../utils/steps';
import { updatePersonAttributes } from '../../actions/person';
import { navigatePush, navigateReset } from '../../actions/navigation';
import { completeOnboarding } from '../../actions/onboardingProfile';
import { buildTrackedScreen, wrapNextAction, wrapNextScreen } from '../helpers';
import { buildTrackingObj, isAndroid } from '../../utils/common';
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
import SuggestedStepDetailScreen from '../../containers/SuggestedStepDetailScreen';
import AddStepScreen from '../../containers/AddStepScreen';
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
import { MAIN_TABS, CREATE_STEP } from '../../constants';

const ME_SUGGESTED_STEP_DETAIL_SCREEN = 'nav/ME_SUGGESTED_STEP_DETAIL_SCREEN';
const PERSON_SUGGESTED_STEP_DETAIL_SCREEN =
  'nav/PERSON_SUGGESTED_STEP_DETAIL_SCREEN';

const ME_ADD_STEP_SCREEN = 'nav/ME_ADD_STEP_SCREEN';
const PERSON_ADD_STEP_SCREEN = 'person/ME_ADD_STEP_SCREEN';

export const TryItNowOnboardingFlowScreens = {
  [WELCOME_SCREEN]: buildTrackedScreen(
    wrapNextScreen(WelcomeScreen, SETUP_SCREEN),
    buildTrackingObj('onboarding : welcome', 'onboarding'),
  ),
  [SETUP_SCREEN]: buildTrackedScreen(
    wrapNextScreen(SetupScreen, GET_STARTED_SCREEN),
    buildTrackingObj('onboarding : name', 'onboarding'),
  ),
  [GET_STARTED_SCREEN]: buildTrackedScreen(
    wrapNextScreen(GetStartedScreen, STAGE_SCREEN),
    buildTrackingObj('onboarding : get started', 'onboarding'),
  ),
  [STAGE_SCREEN]: wrapNextAction(
    StageScreen,
    ({ stage, contactId }) => dispatch => {
      dispatch(
        updatePersonAttributes(contactId, {
          user: { pathway_stage_id: stage.id },
        }),
      );

      dispatch(navigatePush(STAGE_SUCCESS_SCREEN, { selectedStage: stage }));
    },
  ),
  [STAGE_SUCCESS_SCREEN]: buildTrackedScreen(
    wrapNextScreen(StageSuccessScreen, SELECT_MY_STEP_SCREEN),
    buildTrackingObj(
      'onboarding : self : choose my steps',
      'onboarding',
      'self',
    ),
  ),
  [SELECT_MY_STEP_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      SelectMyStepScreen,
      ({ isAddingCustomStep, receiverId, orgId, step }) => dispatch => {
        console.log(isAddingCustomStep);

        return isAddingCustomStep
          ? dispatch(
              navigatePush(ME_ADD_STEP_SCREEN, {
                personId: receiverId,
                orgId,
                type: CREATE_STEP,
              }),
            )
          : dispatch(
              navigatePush(ME_SUGGESTED_STEP_DETAIL_SCREEN, {
                step,
                receiverId,
                orgId,
              }),
            );
      },
    ),
    buildTrackingObj(
      'onboarding : self : steps : add',
      'onboarding',
      'self',
      'steps',
    ),
  ),
  [ME_SUGGESTED_STEP_DETAIL_SCREEN]: {
    screen: wrapNextScreen(SuggestedStepDetailScreen, ADD_SOMEONE_SCREEN),
  },
  [ME_ADD_STEP_SCREEN]: {
    screen: wrapNextAction(
      AddStepScreen,
      ({ text, personId, orgId }) => (dispatch, getState) => {
        dispatch(
          addStep(
            buildCustomStep(text, getState().auth.person.id === personId),
            personId,
            { id: orgId },
          ),
        );
        dispatch(navigatePush(ADD_SOMEONE_SCREEN));
      },
    ),
  },
  [ADD_SOMEONE_SCREEN]: buildTrackedScreen(
    wrapNextScreen(AddSomeoneScreen, SETUP_PERSON_SCREEN),
    buildTrackingObj('onboarding : add person', 'onboarding', 'add person'),
  ),
  [SETUP_PERSON_SCREEN]: buildTrackedScreen(
    wrapNextScreen(SetupPersonScreen, PERSON_STAGE_SCREEN),
    buildTrackingObj(
      'onboarding : add person : name',
      'onboarding',
      'add person',
    ),
  ),
  [PERSON_STAGE_SCREEN]: {
    screen: wrapNextScreen(PersonStageScreen, PERSON_SELECT_STEP_SCREEN),
    navigationOptions: { gesturesEnabled: true },
  },
  [PERSON_SELECT_STEP_SCREEN]: {
    screen: wrapNextAction(
      PersonSelectStepScreen,
      ({ isAddingCustomStep, receiverId, orgId, step }) => dispatch => {
        console.log(isAddingCustomStep);

        return isAddingCustomStep
          ? dispatch(
              navigatePush(PERSON_ADD_STEP_SCREEN, {
                personId: receiverId,
                orgId,
                type: CREATE_STEP,
              }),
            )
          : dispatch(
              navigatePush(PERSON_SUGGESTED_STEP_DETAIL_SCREEN, {
                step,
                receiverId,
                orgId,
              }),
            );
      },
    ),
    navigationOptions: { gesturesEnabled: true },
  },
  [PERSON_SUGGESTED_STEP_DETAIL_SCREEN]: {
    screen: wrapNextScreen(
      SuggestedStepDetailScreen,
      NOTIFICATION_PRIMER_SCREEN,
    ),
  },
  [PERSON_ADD_STEP_SCREEN]: {
    screen: wrapNextAction(
      AddStepScreen,
      ({ text, personId, orgId }) => (dispatch, getState) => {
        dispatch(
          addStep(
            buildCustomStep(text, getState().auth.person.id === personId),
            personId,
            { id: orgId },
          ),
        );

        return dispatch(
          navigatePush(
            isAndroid ? CELEBRATION_SCREEN : NOTIFICATION_PRIMER_SCREEN,
          ),
        );
      },
    ),
  },
  [NOTIFICATION_PRIMER_SCREEN]: buildTrackedScreen(
    wrapNextScreen(NotificationPrimerScreen, CELEBRATION_SCREEN),
    buildTrackingObj(
      'menu : notifications : permissions',
      'menu',
      'notifications',
    ),
  ),
  [CELEBRATION_SCREEN]: wrapNextAction(CelebrationScreen, () => dispatch => {
    dispatch(completeOnboarding());
    dispatch(navigateReset(MAIN_TABS));
  }),
};
export const TryItNowOnboardingFlowNavigator = createStackNavigator(
  TryItNowOnboardingFlowScreens,
  {
    navigationOptions: {
      header: null,
    },
  },
);
