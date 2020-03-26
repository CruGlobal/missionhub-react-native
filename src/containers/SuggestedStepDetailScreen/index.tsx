import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ThunkAction } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';
import { useQuery, useMutation } from '@apollo/react-hooks';

import StepDetailScreen from '../../components/StepDetailScreen';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import {
  getAnalyticsSectionType,
  getAnalyticsAssignmentType,
} from '../../utils/analytics';
import { AuthState } from '../../reducers/auth';
import { OnboardingState } from '../../reducers/onboarding';
import {
  ANALYTICS_SECTION_TYPE,
  ANALYTICS_ASSIGNMENT_TYPE,
} from '../../constants';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import { STEPS_QUERY } from '../StepsScreen/queries';
import { PERSON_STEPS_QUERY } from '../ContactSteps/queries';
import { trackStepAdded } from '../../actions/analytics';

import styles from './styles';
import {
  STEP_SUGGESTION_QUERY,
  CREATE_STEP_FROM_SUGGESTION_MUTATION,
} from './queries';
import {
  StepSuggestion,
  StepSuggestionVariables,
} from './__generated__/StepSuggestion';
import {
  CreateStepFromSuggestion,
  CreateStepFromSuggestionVariables,
} from './__generated__/CreateStepFromSuggestion';

interface SuggestedStepDetailScreenProps {
  next: (props: {
    personId: string;
    orgId: string | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => ThunkAction<void, any, {}, never>;
}

const SuggestedStepDetailScreen = ({
  next,
}: SuggestedStepDetailScreenProps) => {
  const { t } = useTranslation('suggestedStepDetail');
  const dispatch = useDispatch();
  const stepSuggestionId: string = useNavigationParam('stepSuggestionId');
  const personId: string = useNavigationParam('personId');
  const orgId: string | undefined = useNavigationParam('orgId');

  const analyticsSection = useSelector(
    ({ onboarding }: { onboarding: OnboardingState }) =>
      getAnalyticsSectionType(onboarding),
  );
  const analyticsAssignmentType = useSelector(({ auth }: { auth: AuthState }) =>
    getAnalyticsAssignmentType({ id: personId }, auth),
  );
  useAnalytics(['step detail', 'add step'], {
    screenContext: {
      [ANALYTICS_SECTION_TYPE]: analyticsSection,
      [ANALYTICS_ASSIGNMENT_TYPE]: analyticsAssignmentType,
    },
  });

  const { data, error, refetch } = useQuery<
    StepSuggestion,
    StepSuggestionVariables
  >(STEP_SUGGESTION_QUERY, {
    variables: { stepSuggestionId, personId },
  });

  const [createSuggestedStep, { error: errorCreateStep }] = useMutation<
    CreateStepFromSuggestion,
    CreateStepFromSuggestionVariables
  >(CREATE_STEP_FROM_SUGGESTION_MUTATION, {
    onCompleted: data => dispatch(trackStepAdded(data.createStep?.step)),
    refetchQueries: [
      { query: STEPS_QUERY },
      {
        query: PERSON_STEPS_QUERY,
        variables: { personId, completed: false },
      },
    ],
  });

  const handleAddStep = async () => {
    await createSuggestedStep({
      variables: { receiverId: personId, communityId: orgId, stepSuggestionId },
    });
    dispatch(next({ personId, orgId }));
  };

  return (
    <StepDetailScreen
      CenterHeader={null}
      RightHeader={null}
      CenterContent={<View style={styles.centerContent} />}
      Banner={
        <>
          <ErrorNotice
            message={t('errorLoadingSuggestedStepDetails')}
            error={error}
            refetch={refetch}
          />
          <ErrorNotice
            message={t('errorSavingStep')}
            error={errorCreateStep}
            refetch={handleAddStep}
          />
        </>
      }
      text={data?.stepSuggestion.body}
      stepType={data?.stepSuggestion.stepType}
      firstName={data?.person.firstName}
      markdown={data?.stepSuggestion.descriptionMarkdown ?? undefined}
      bottomButtonProps={{
        onPress: handleAddStep,
        text: t('addStep'),
      }}
    />
  );
};

export default SuggestedStepDetailScreen;
export const SUGGESTED_STEP_DETAIL_SCREEN = 'nav/SUGGESTED_STEP_DETAIL_SCREEN';
