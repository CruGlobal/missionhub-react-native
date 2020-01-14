/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { AuthState } from '../../reducers/auth';
import { navigatePush, navigateToMainTabs } from '../../actions/navigation';
import { createCustomStep } from '../../actions/steps';
import {
  skipAddPersonAndCompleteOnboarding,
  resetPersonAndCompleteOnboarding,
  setOnboardingPersonId,
} from '../../actions/onboarding';
import { wrapNextAction, wrapNextScreen } from '../helpers';
import { CREATE_STEP } from '../../constants';
import WelcomeScreen, { WELCOME_SCREEN } from '../../containers/WelcomeScreen';
import SetupScreen, {
  SETUP_SCREEN,
  SETUP_PERSON_SCREEN,
} from '../../containers/SetupScreen';
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
import { OnboardingState } from '../../reducers/onboarding';

export const onboardingFlowGenerator = ({
  startScreen = WELCOME_SCREEN,
  hideSkipBtn,
}: {
  startScreen?: string;
  hideSkipBtn?: boolean;
} = {}) => ({
  ...(startScreen === WELCOME_SCREEN
    ? {
        [WELCOME_SCREEN]: wrapNextScreen(WelcomeScreen, SETUP_SCREEN),
        [SETUP_SCREEN]: wrapNextScreen(SetupScreen, GET_STARTED_SCREEN, {
          isMe: true,
        }),
      }
    : {}),
  ...(startScreen === WELCOME_SCREEN || startScreen === GET_STARTED_SCREEN
    ? {
        [GET_STARTED_SCREEN]: wrapNextAction(
          GetStartedScreen,
          () => (
            dispatch: ThunkDispatch<{}, {}, AnyAction>,
            getState: () => { auth: AuthState },
          ) =>
            dispatch(
              navigatePush(SELECT_STAGE_SCREEN, {
                section: 'onboarding',
                subsection: 'self',
                personId: getState().auth.person.id,
              }),
            ),
          {
            logoutOnBack: startScreen === GET_STARTED_SCREEN,
          },
        ),
        [STAGE_SUCCESS_SCREEN]: wrapNextScreen(
          StageSuccessScreen,
          SELECT_MY_STEP_SCREEN,
        ),
        [SELECT_MY_STEP_SCREEN]: wrapNextAction(
          SelectMyStepScreen,
          ({ personId, step }: { personId: string; step: object }) =>
            step
              ? navigatePush(SUGGESTED_STEP_DETAIL_SCREEN, {
                  step,
                  personId,
                })
              : navigatePush(ADD_STEP_SCREEN, {
                  type: CREATE_STEP,
                  personId,
                }),
        ),
      }
    : {}),
  [ADD_SOMEONE_SCREEN]: wrapNextAction(
    AddSomeoneScreen,
    ({ skip }: { skip: boolean }) =>
      skip
        ? skipAddPersonAndCompleteOnboarding()
        : navigatePush(SETUP_PERSON_SCREEN),
    {
      hideSkipBtn,
      logoutOnBack: startScreen === ADD_SOMEONE_SCREEN,
    },
  ),
  [SETUP_PERSON_SCREEN]: wrapNextAction(
    SetupScreen,
    ({ skip, personId }: { skip?: boolean; personId?: string } = {}) => (
      dispatch: ThunkDispatch<{}, {}, AnyAction>,
      getState: () => { onboarding: OnboardingState },
    ) => {
      personId && dispatch(setOnboardingPersonId(personId));
      dispatch(
        skip
          ? skipAddPersonAndCompleteOnboarding()
          : navigatePush(SELECT_STAGE_SCREEN, {
              section: 'onboarding',
              subsection: 'add person',
              personId: getState().onboarding.personId,
            }),
      );
    },
    { isMe: false, hideSkipBtn },
  ),
  [SELECT_STAGE_SCREEN]: wrapNextAction(
    SelectStageScreen,
    ({ isMe }: { isMe: boolean }) => (
      dispatch: ThunkDispatch<{}, {}, AnyAction>,
      getState: () => { onboarding: OnboardingState },
    ) =>
      dispatch(
        isMe
          ? navigatePush(STAGE_SUCCESS_SCREEN)
          : navigatePush(PERSON_SELECT_STEP_SCREEN, {
              personId: getState().onboarding.personId,
            }),
      ),
  ),
  [PERSON_SELECT_STEP_SCREEN]: wrapNextAction(
    PersonSelectStepScreen,
    ({ personId, step }: { personId: string; step: object }) =>
      step
        ? navigatePush(SUGGESTED_STEP_DETAIL_SCREEN, {
            step,
            personId,
          })
        : navigatePush(ADD_STEP_SCREEN, {
            type: CREATE_STEP,
            personId,
          }),
  ),
  [SUGGESTED_STEP_DETAIL_SCREEN]: wrapNextAction(
    SuggestedStepDetailScreen,
    ({ personId }: { personId: string }) => (
      dispatch: ThunkDispatch<any, null, any>,
      getState: () => any,
    ) => {
      const isMe = personId === getState().auth.person.id;

      if (isMe) {
        return dispatch(navigatePush(ADD_SOMEONE_SCREEN));
      }
      dispatch(resetPersonAndCompleteOnboarding());
    },
  ),
  [ADD_STEP_SCREEN]: wrapNextAction(
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
      dispatch(resetPersonAndCompleteOnboarding());
    },
  ),
  [CELEBRATION_SCREEN]: wrapNextAction(CelebrationScreen, () =>
    navigateToMainTabs(),
  ),
});
