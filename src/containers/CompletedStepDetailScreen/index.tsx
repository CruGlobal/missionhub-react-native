import React from 'react';
import { Image, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { useQuery } from '@apollo/react-hooks';

import StepDetailScreen from '../../components/StepDetailScreen';
import GREY_CHECKBOX from '../../../assets/images/checkIcon-grey.png';
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

  useAnalytics(['step detail', 'completed step']);
  const { t } = useTranslation('completedStepDetail');
  const { data, error, refetch } = useQuery<
    CompletedStepDetail,
    CompletedStepDetailVariables
  >(COMPLETED_STEP_DETAIL_QUERY, {
    variables: { id: stepId },
  });

  return (
    <StepDetailScreen
      firstName={data?.step.receiver.firstName}
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
            {data?.step.completedAt
              ? t('completedOn', {
                  date: getMomentDate(data.step.completedAt).format(
                    'dddd, MMMM D YYYY',
                  ),
                })
              : null}
          </Text>
          <Image source={GREY_CHECKBOX} style={styles.completedIcon} />
        </View>
      }
      post={data?.step.post ?? undefined}
      markdown={data?.step.stepSuggestion?.descriptionMarkdown ?? undefined}
      text={data?.step.title}
      stepType={data?.step.stepType}
    />
  );
};

export default CompletedStepDetailScreen;
export const COMPLETED_STEP_DETAIL_SCREEN = 'nav/COMPLETED_STEP_DETAIL_SCREEN';
