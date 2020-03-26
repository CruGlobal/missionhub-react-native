import React from 'react';
import { Image, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';

import { ANALYTICS_ASSIGNMENT_TYPE } from '../../constants';
import { Text } from '../../components/common';
import { getAnalyticsAssignmentType } from '../../utils/analytics';
import StepDetailScreen from '../../components/StepDetailScreen';
import GREY_CHECKBOX from '../../../assets/images/checkIcon-grey.png';
import { AuthState } from '../../reducers/auth';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';

import styles from './styles';
import { COMPLETED_STEP_DETAIL_QUERY } from './queries';
import {
  CompletedStepDetail,
  CompletedStepDetailVariables,
} from './__generated__/CompletedStepDetail';

const CompletedStepDetailScreen = () => {
  const analyticsAssignmentType = useSelector(
    ({ auth }: { auth: AuthState }) =>
      getAnalyticsAssignmentType({ id: '' }, auth), // TODO: What do we do when the person isn't loaded yet?
  );
  useAnalytics(['step detail', 'completed step'], {
    screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: analyticsAssignmentType },
  });
  const { t } = useTranslation('completedStepDetail');
  const { data, error, refetch } = useQuery<
    CompletedStepDetail,
    CompletedStepDetailVariables
  >(COMPLETED_STEP_DETAIL_QUERY, {
    variables: { id: useNavigationParam('stepId') },
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
            {t('completedOn', {
              date: moment(data?.step.completedAt ?? undefined).format(
                'dddd, MMMM D YYYY',
              ),
            })}
          </Text>
          <Image source={GREY_CHECKBOX} style={styles.completedIcon} />
        </View>
      }
      markdown={data?.step.stepSuggestion?.descriptionMarkdown ?? undefined}
      text={data?.step.title}
      stepType={data?.step.stepType}
    />
  );
};

export default CompletedStepDetailScreen;
export const COMPLETED_STEP_DETAIL_SCREEN = 'nav/COMPLETED_STEP_DETAIL_SCREEN';
