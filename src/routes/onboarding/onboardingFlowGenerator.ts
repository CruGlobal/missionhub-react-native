import { navigatePush } from '../../actions/navigation';
import { createCustomStep } from '../../actions/steps';
import { buildTrackingObj } from '../../utils/common';
import { buildTrackedScreen, wrapNextAction, wrapNextScreen } from '../helpers';
import { CREATE_STEP } from '../../constants';
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
import SuggestedStepDetailScreen, {
  SUGGESTED_STEP_DETAIL_SCREEN,
} from '../../containers/SuggestedStepDetailScreen';
import AddStepScreen, { ADD_STEP_SCREEN } from '../../containers/AddStepScreen';
import NotificationPrimerScreen, {
  NOTIFICATION_PRIMER_SCREEN,
} from '../../containers/NotificationPrimerScreen';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../../containers/CelebrationScreen';

export const onboardingFlowGenerator = ({
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
          wrapNextAction(StageScreen, ({ stage }) => dispatch => {
            dispatch(
              navigatePush(STAGE_SUCCESS_SCREEN, { selectedStage: stage }),
            );
          }),
          buildTrackingObj('onboarding : name', 'onboarding'),
        ),
        [STAGE_SUCCESS_SCREEN]: buildTrackedScreen(
          wrapNextAction(
            StageSuccessScreen,
            ({ selectedStage }) => dispatch => {
              dispatch(
                navigatePush(SELECT_MY_STEP_SCREEN, {
                  contactStage: selectedStage,
                  enableBackButton: false,
                }),
              );
            },
          ),
          buildTrackingObj(
            'onboarding : self : choose my steps',
            'onboarding',
            'self',
          ),
        ),
        [SELECT_MY_STEP_SCREEN]: buildTrackedScreen(
          wrapNextAction(
            SelectMyStepScreen,
            ({ receiverId, step }) => dispatch =>
              dispatch(
                step
                  ? navigatePush(SUGGESTED_STEP_DETAIL_SCREEN, {
                      step,
                      receiverId,
                    })
                  : navigatePush(ADD_STEP_SCREEN, {
                      type: CREATE_STEP,
                      personId: receiverId,
                      trackingObj: buildTrackingObj(
                        'onboarding : self : steps : create',
                        'onboarding',
                        'self',
                        'steps',
                      ),
                    }),
              ),
          ),
          buildTrackingObj(
            'people : self : steps : add',
            'people',
            'self',
            'steps',
          ),
        ),
      }
    : {}),
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
    wrapNextAction(PersonSelectStepScreen, () => dispatch => {}),
    buildTrackingObj('onboarding : name', 'onboarding'),
  ),
  [SUGGESTED_STEP_DETAIL_SCREEN]: buildTrackedScreen(
    wrapNextScreen(SuggestedStepDetailScreen, ADD_SOMEONE_SCREEN),
  ),
  [ADD_STEP_SCREEN]: buildTrackedScreen(
    wrapNextAction(AddStepScreen, ({ text, personId }) => dispatch => {
      dispatch(createCustomStep(text, personId));
      dispatch(navigatePush(ADD_SOMEONE_SCREEN));
    }),
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
});
