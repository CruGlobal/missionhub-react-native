/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkDispatch } from 'redux-thunk';

import { navigatePush, navigateToMainTabs } from '../../actions/navigation';
import { createCustomStep } from '../../actions/steps';
import { skipOnboarding } from '../../actions/onboardingProfile';
import { showReminderOnLoad } from '../../actions/notifications';
import { trackActionWithoutData } from '../../actions/analytics';
import { buildTrackingObj } from '../../utils/common';
import { buildTrackedScreen, wrapNextAction, wrapNextScreen } from '../helpers';
import {
  ACTIONS,
  CREATE_STEP,
  NOTIFICATION_PROMPT_TYPES,
} from '../../constants';
import WelcomeScreen, { WELCOME_SCREEN } from '../../containers/WelcomeScreen';
import SetupScreen, { SETUP_SCREEN } from '../../containers/SetupScreen';
import GetStartedScreen, {
  GET_STARTED_SCREEN,
} from '../../containers/GetStartedScreen';
import SelectStageScreen, {
  SELECT_STAGE_SCREEN,
} from '../../containers/SelectStageScreen';
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
import PersonSelectStepScreen, {
  PERSON_SELECT_STEP_SCREEN,
} from '../../containers/PersonSelectStepScreen';
import SuggestedStepDetailScreen, {
  SUGGESTED_STEP_DETAIL_SCREEN,
} from '../../containers/SuggestedStepDetailScreen';
import AddStepScreen, { ADD_STEP_SCREEN } from '../../containers/AddStepScreen';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../../containers/CelebrationScreen';

const showNotificationAndCompleteOnboarding = async (
  dispatch: ThunkDispatch<any, null, any>,
) => {
  await dispatch(
    showReminderOnLoad(NOTIFICATION_PROMPT_TYPES.ONBOARDING, true),
  );
  dispatch(trackActionWithoutData(ACTIONS.ONBOARDING_COMPLETE));

  dispatch(navigatePush(CELEBRATION_SCREEN));
};

export const onboardingFlowGenerator = ({
  startScreen = WELCOME_SCREEN,
  hideSkipBtn,
}: {
  startScreen?: string;
  hideSkipBtn?: boolean;
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
          wrapNextAction(
            GetStartedScreen,
            ({ id }: { id: string }) =>
              navigatePush(SELECT_STAGE_SCREEN, {
                section: 'onboarding',
                subsection: 'self',
                personId: id,
              }),
            {
              logoutOnBack: startScreen === GET_STARTED_SCREEN,
            },
          ),
          buildTrackingObj('onboarding : get started', 'onboarding'),
        ),
        [STAGE_SUCCESS_SCREEN]: buildTrackedScreen(
          wrapNextAction(
            StageSuccessScreen,
            ({ selectedStage }: { selectedStage: object }) =>
              navigatePush(SELECT_MY_STEP_SCREEN, {
                contactStage: selectedStage,
              }),
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
            ({ receiverId, step }: { receiverId: string; step: object }) =>
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
          buildTrackingObj(
            'onboarding : self : steps : add',
            'onbaording',
            'self',
            'steps',
          ),
        ),
      }
    : {}),
  [ADD_SOMEONE_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      AddSomeoneScreen,
      ({ skip }: { skip: boolean }) =>
        skip ? skipOnboarding() : navigatePush(SETUP_PERSON_SCREEN),
      {
        hideSkipBtn,
        logoutOnBack: startScreen === ADD_SOMEONE_SCREEN,
      },
    ),
    buildTrackingObj('onboarding : add person', 'onboarding', 'add person'),
  ),
  [SETUP_PERSON_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      SetupPersonScreen,
      ({ skip, personId }: { skip: boolean; personId: string }) =>
        skip
          ? skipOnboarding()
          : navigatePush(SELECT_STAGE_SCREEN, {
              section: 'onboarding',
              subsection: 'add person',
              personId,
            }),
      { hideSkipBtn },
    ),
    buildTrackingObj(
      'onboarding : add person : name',
      'onboarding',
      'add person',
    ),
  ),
  [SELECT_STAGE_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      SelectStageScreen,
      ({
        stage,
        firstName,
        personId,
        isMe,
      }: {
        stage: object;
        firstName: string;
        personId: string;
        isMe: boolean;
      }) =>
        isMe
          ? navigatePush(STAGE_SUCCESS_SCREEN, { selectedStage: stage })
          : navigatePush(PERSON_SELECT_STEP_SCREEN, {
              contactStage: stage,
              contactName: firstName,
              contactId: personId,
            }),
    ),
  ),
  [PERSON_SELECT_STEP_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      PersonSelectStepScreen,
      ({ receiverId, step }: { receiverId: string; step: object }) =>
        step
          ? navigatePush(SUGGESTED_STEP_DETAIL_SCREEN, {
              step,
              receiverId,
            })
          : navigatePush(ADD_STEP_SCREEN, {
              type: CREATE_STEP,
              personId: receiverId,
              trackingObj: buildTrackingObj(
                'onboarding : person : steps : create',
                'onboarding',
                'person',
                'steps',
              ),
            }),
    ),
    buildTrackingObj(
      'onboarding : add person : steps : add',
      'onboarding',
      'add person',
      'steps',
    ),
  ),
  [SUGGESTED_STEP_DETAIL_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      SuggestedStepDetailScreen,
      ({ contactId }: { contactId: string }) => (
        dispatch: ThunkDispatch<any, null, any>,
        getState: () => any,
      ) => {
        const isMe = contactId === getState().auth.person.id;

        if (isMe) {
          return dispatch(navigatePush(ADD_SOMEONE_SCREEN));
        }
        showNotificationAndCompleteOnboarding(dispatch);
      },
    ),
  ),
  [ADD_STEP_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      AddStepScreen,
      ({ text, personId }: { text: string; personId: string }) => (
        dispatch: ThunkDispatch<any, null, any>,
        getState: () => any,
      ) => {
        const isMe = personId === getState().auth.person.id;

        dispatch(createCustomStep(text, personId));

        if (isMe) {
          return dispatch(navigatePush(ADD_SOMEONE_SCREEN));
        }
        showNotificationAndCompleteOnboarding(dispatch);
      },
    ),
  ),
  [CELEBRATION_SCREEN]: buildTrackedScreen(
    wrapNextAction(CelebrationScreen, () => navigateToMainTabs()),
    buildTrackingObj('onboarding : complete', 'onboarding'),
  ),
});
