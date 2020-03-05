import React from 'react';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';

import { TrackStateContext } from '../../actions/analytics';
import { ANALYTICS_ASSIGNMENT_TYPE } from '../../constants';
import { Text } from '../../components/common';
import { getAnalyticsAssignmentType } from '../../utils/analytics';
import StepDetailScreen from '../../components/StepDetailScreen';
import GREY_CHECKBOX from '../../../assets/images/checkIcon-grey.png';
import { Step } from '../../reducers/steps';
import { AuthState } from '../../reducers/auth';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';

import styles from './styles';
import { COMPLETED_STEP_DETAIL_QUERY } from './queries';
import {
  CompletedStepDetail,
  CompletedStepDetailVariables,
} from './__generated__/CompletedStepDetail';

interface CompletedStepDetailScreenProps {
  analyticsAssignmentType: TrackStateContext[typeof ANALYTICS_ASSIGNMENT_TYPE];
}

const CompletedStepDetailScreen = ({
  analyticsAssignmentType,
}: CompletedStepDetailScreenProps) => {
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
            {t('completedOn', {
              date: moment(step?.completedAt ?? undefined).format(
                'dddd, MMMM D YYYY',
              ),
            })}
          </Text>
          <Image source={GREY_CHECKBOX} style={styles.completedIcon} />
        </View>
      }
      markdown={step?.stepSuggestion?.descriptionMarkdown ?? undefined}
      text={step?.title}
    />
  );
};

const mapStateToProps = (
  { auth }: { auth: AuthState },
  {
    navigation: {
      state: {
        params: { step },
      },
    } = { state: { params: { step: {} as Step } } },
  }: { navigation?: { state: { params: { step: Step } } } },
) => ({
  analyticsAssignmentType: getAnalyticsAssignmentType(step.receiver, auth),
});

export default connect(mapStateToProps)(CompletedStepDetailScreen);
export const COMPLETED_STEP_DETAIL_SCREEN = 'nav/COMPLETED_STEP_DETAIL_SCREEN';
