/* eslint-disable @typescript-eslint/no-explicit-any */

import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import appsFlyer from 'react-native-appsflyer';

import { navigatePush, navigateToMainTabs } from '../../actions/navigation';
import {
  skipAddPersonAndCompleteOnboarding,
  resetPersonAndCompleteOnboarding,
  setOnboardingPersonId,
} from '../../actions/onboarding';
import { trackActionWithoutData } from '../../actions/analytics';
import { wrapNextAction, wrapNextScreen } from '../helpers';
import { CREATE_STEP, ACTIONS } from '../../constants';
import WelcomeScreen, { WELCOME_SCREEN } from '../../containers/WelcomeScreen';
import SetupScreen, {
  SETUP_SCREEN,
  SETUP_PERSON_SCREEN,
} from '../../containers/SetupScreen';
import {
  OnboardingAddPhotoScreen,
  ONBOARDING_ADD_PHOTO_SCREEN,
} from '../../containers/OnboardingAddPhotoScreen';
import PersonCategoryScreen, {
  PERSON_CATEGORY_SCREEN,
} from '../../containers/PersonCategoryScreen';
import GetStartedScreen from '../../containers/GetStartedScreen';
import { GET_STARTED_SCREEN } from '../../containers/GetStartedScreen/constants';
import SelectStageScreen, {
  SELECT_STAGE_SCREEN,
} from '../../containers/SelectStageScreen';
import StageSuccessScreen, {
  STAGE_SUCCESS_SCREEN,
} from '../../containers/StageSuccessScreen';
import SelectStepScreen, {
  SELECT_STEP_SCREEN,
  SelectStepScreenNextProps,
} from '../../containers/SelectStepScreen';
import AddSomeoneScreen, {
  ADD_SOMEONE_SCREEN,
} from '../../containers/AddSomeoneScreen';
import SuggestedStepDetailScreen, {
  SUGGESTED_STEP_DETAIL_SCREEN,
} from '../../containers/SuggestedStepDetailScreen';
import NotificationPrimerScreen, {
  NOTIFICATION_PRIMER_SCREEN,
} from '../../containers/NotificationPrimerScreen';
import NotificationOffScreen, {
  NOTIFICATION_OFF_SCREEN,
} from '../../containers/NotificationOffScreen';
import AddStepScreen, {
  ADD_STEP_SCREEN,
  AddStepScreenNextProps,
} from '../../containers/AddStepScreen';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../../containers/CelebrationScreen';
import { OnboardingState } from '../../reducers/onboarding';
import { RelationshipTypeEnum } from '../../../__generated__/globalTypes';
import { RootState } from '../../reducers';
import { getAuthPerson } from '../../auth/authUtilities';

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
        [SETUP_SCREEN]: wrapNextScreen(
          SetupScreen,
          ONBOARDING_ADD_PHOTO_SCREEN,
          {
            isMe: true,
          },
        ),
        [ONBOARDING_ADD_PHOTO_SCREEN]: wrapNextScreen(
          OnboardingAddPhotoScreen,
          GET_STARTED_SCREEN,
        ),
      }
    : {}),
  ...(startScreen === WELCOME_SCREEN || startScreen === GET_STARTED_SCREEN
    ? {
        [GET_STARTED_SCREEN]: wrapNextAction(
          GetStartedScreen,
          () => (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
            dispatch(
              navigatePush(SELECT_STAGE_SCREEN, {
                section: 'onboarding',
                subsection: 'self',
                personId: getAuthPerson().id,
              }),
            );
          },
          {
            logoutOnBack: startScreen === GET_STARTED_SCREEN,
          },
        ),
        [STAGE_SUCCESS_SCREEN]: wrapNextAction(
          StageSuccessScreen,
          () => (dispatch: ThunkDispatch<RootState, never, AnyAction>) =>
            dispatch(
              navigatePush(SELECT_STEP_SCREEN, {
                personId: getAuthPerson().id,
              }),
            ),
        ),
      }
    : {}),
  [ADD_SOMEONE_SCREEN]: wrapNextAction(
    AddSomeoneScreen,
    ({ skip }: { skip: boolean }) =>
      skip
        ? skipAddPersonAndCompleteOnboarding()
        : navigatePush(PERSON_CATEGORY_SCREEN),
    {
      hideSkipBtn,
      logoutOnBack: startScreen === ADD_SOMEONE_SCREEN,
    },
  ),
  [PERSON_CATEGORY_SCREEN]: wrapNextAction(
    PersonCategoryScreen,
    ({
      skip,
      relationshipType,
    }: {
      skip: boolean;
      relationshipType: RelationshipTypeEnum;
    }) =>
      skip
        ? skipAddPersonAndCompleteOnboarding()
        : navigatePush(SETUP_PERSON_SCREEN, {
            relationshipType,
          }),
  ),
  [SETUP_PERSON_SCREEN]: wrapNextAction(
    SetupScreen,
    ({ skip, personId }: { skip?: boolean; personId?: string } = {}) => (
      dispatch: ThunkDispatch<RootState, never, AnyAction>,
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
    { isMe: false, hideSkipBtn: true },
  ),
  [SELECT_STAGE_SCREEN]: wrapNextAction(
    SelectStageScreen,
    ({ isMe }: { isMe: boolean }) => (
      dispatch: ThunkDispatch<RootState, never, AnyAction>,
      getState: () => { onboarding: OnboardingState },
    ) =>
      dispatch(
        isMe
          ? navigatePush(STAGE_SUCCESS_SCREEN)
          : navigatePush(SELECT_STEP_SCREEN, {
              personId: getState().onboarding.personId,
            }),
      ),
  ),
  [SELECT_STEP_SCREEN]: wrapNextAction(
    SelectStepScreen,
    ({ personId, stepSuggestionId, stepType }: SelectStepScreenNextProps) =>
      stepSuggestionId
        ? navigatePush(SUGGESTED_STEP_DETAIL_SCREEN, {
            stepSuggestionId,
            personId,
          })
        : navigatePush(ADD_STEP_SCREEN, {
            type: CREATE_STEP,
            stepType,
            personId,
          }),
  ),
  [SUGGESTED_STEP_DETAIL_SCREEN]: wrapNextAction(
    SuggestedStepDetailScreen,
    ({ personId }: { personId: string }) => (
      dispatch: ThunkDispatch<RootState, never, AnyAction>,
    ) => {
      const isMe = personId === getAuthPerson().id;

      if (isMe) {
        return dispatch(navigatePush(ADD_SOMEONE_SCREEN));
      }
      dispatch(resetPersonAndCompleteOnboarding());
    },
  ),
  [ADD_STEP_SCREEN]: wrapNextAction(
    AddStepScreen,
    ({ personId }: AddStepScreenNextProps) => (
      dispatch: ThunkDispatch<RootState, never, AnyAction>,
    ) => {
      const isMe = personId === getAuthPerson().id;

      if (isMe) {
        return dispatch(navigatePush(ADD_SOMEONE_SCREEN));
      }
      dispatch(resetPersonAndCompleteOnboarding());
    },
  ),
  [NOTIFICATION_PRIMER_SCREEN]: wrapNextScreen(
    NotificationPrimerScreen,
    CELEBRATION_SCREEN,
  ),
  [NOTIFICATION_OFF_SCREEN]: wrapNextScreen(
    NotificationOffScreen,
    CELEBRATION_SCREEN,
  ),
  [CELEBRATION_SCREEN]: wrapNextAction(
    CelebrationScreen,
    () => (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
      dispatch(trackActionWithoutData(ACTIONS.ONBOARDING_COMPLETE));
      appsFlyer.trackEvent(
        ACTIONS.ONBOARDING_COMPLETE.name,
        ACTIONS.ONBOARDING_COMPLETE,
      );
      dispatch(navigateToMainTabs());
    },
  ),
});
