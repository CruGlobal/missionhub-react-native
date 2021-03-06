import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ThunkAction } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { AnyAction } from 'redux';

import StepDetailScreen from '../../components/StepDetailScreen';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import { STEPS_QUERY } from '../StepsScreen/queries';
import { PERSON_STEPS_QUERY } from '../PersonScreen/PersonSteps/queries';
import { trackStepAdded } from '../../actions/analytics';
import { updatePersonGQL } from '../../actions/person';
import { insertName } from '../../utils/steps';
import { RootState } from '../../reducers';

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
  }) => ThunkAction<void, RootState, never, AnyAction>;
}

const SuggestedStepDetailScreen = ({
  next,
}: SuggestedStepDetailScreenProps) => {
  const { t } = useTranslation('suggestedStepDetail');
  const dispatch = useDispatch();
  const stepSuggestionId: string = useNavigationParam('stepSuggestionId');
  const personId: string = useNavigationParam('personId');
  const orgId: string | undefined = useNavigationParam('orgId');

  useAnalytics(['step detail', 'add step']);

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
    onCompleted: data =>
      dispatch(trackStepAdded(data.createStepFromSuggestion?.step)),
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
      variables: { receiverId: personId, stepSuggestionId },
    });
    updatePersonGQL(personId);
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
      text={
        data ? insertName(data.stepSuggestion.body, data.person.firstName) : ''
      }
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
