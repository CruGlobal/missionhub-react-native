import React from 'react';
import { Image, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { ANALYTICS_ASSIGNMENT_TYPE } from '../../constants';
import { Text } from '../../components/common';
import { getAnalyticsAssignmentType } from '../../utils/analytics';
import StepDetailScreen from '../../components/StepDetailScreen';
import GREY_CHECKBOX from '../../../assets/images/checkIcon-grey.png';
import { AuthState } from '../../reducers/auth';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import { getMomentDate } from '../../utils/date';

import styles from './styles';
import { COMPLETED_STEP_DETAIL_QUERY } from './queries';
import {
  CompletedStepDetail,
  CompletedStepDetailVariables,
} from './__generated__/CompletedStepDetail';

const CompletedStepDetailScreen = () => {
  const stepId = useNavigationParam('stepId');

  const apolloClient = useApolloClient();

  const analyticsAssignmentType = useSelector(
    ({ auth }: { auth: AuthState }) => {
      let stepReceiverId = '';
      try {
        const step = apolloClient.readFragment({
          id: `Step:${stepId}`,
          fragment: gql`
            fragment stepReceiver on Step {
              receiver {
                id
              }
            }
          `,
        });
        stepReceiverId = step.receiver.id;
      } catch {}

      return getAnalyticsAssignmentType({ id: stepReceiverId }, auth);
    },
  );
  useAnalytics(['step detail', 'completed step'], {
    screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: analyticsAssignmentType },
  });
  const { t } = useTranslation('completedStepDetail');
  const { data, error, refetch } = useQuery<
    CompletedStepDetail,
    CompletedStepDetailVariables
  >(COMPLETED_STEP_DETAIL_QUERY, {
    variables: { id: stepId },
  });

  const step = data?.step;

  return (
    <StepDetailScreen
      receiver={step?.receiver}
      Banner={
        <ErrorNotice
          message={t('errorLoadingStepDetails')}
          error={error}
          refetch={refetch}
        />
      }
      CenterHeader={<Text>{t('completedStep')}</Text>}
      RightHeader={null}
      CenterContent={
        <View style={styles.reminderButton}>
          <Text style={styles.completedText}>
            {step?.completedAt
              ? t('completedOn', {
                  date: getMomentDate(step.completedAt).format(
                    'dddd, MMMM D YYYY',
                  ),
                })
              : null}
          </Text>
          <Image source={GREY_CHECKBOX} style={styles.completedIcon} />
        </View>
      }
      markdown={step?.stepSuggestion?.descriptionMarkdown ?? undefined}
      text={step?.title}
    />
  );
};

export default CompletedStepDetailScreen;
export const COMPLETED_STEP_DETAIL_SCREEN = 'nav/COMPLETED_STEP_DETAIL_SCREEN';
