import React from 'react';
import { connect } from 'react-redux-legacy';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ThunkAction } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';

import { TrackStateContext } from '../../actions/analytics';
import { addStep } from '../../actions/steps';
import StepDetailScreen from '../../components/StepDetailScreen';
import { SuggestedStep } from '../../reducers/steps';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { getAnalyticsSectionType } from '../../utils/common';
import { OnboardingState } from '../../reducers/onboarding';
import { ANALYTICS_SECTION_TYPE } from '../../constants';

import styles from './styles';

interface SuggestedStepDetailScreenProps {
  next: (props: {
    personId: string;
    orgId: string | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => ThunkAction<void, any, {}, never>;
  analyticsSection: TrackStateContext[typeof ANALYTICS_SECTION_TYPE];
}

const SuggestedStepDetailScreen = ({
  next,
  analyticsSection,
}: SuggestedStepDetailScreenProps) => {
  useAnalytics(['step detail', 'add step'], {
    screenContext: {
      [ANALYTICS_SECTION_TYPE]: analyticsSection,
    },
  });
  const { t } = useTranslation('suggestedStepDetail');
  const dispatch = useDispatch();
  const step: SuggestedStep = useNavigationParam('step');
  const personId: string = useNavigationParam('personId');
  const orgId: string | undefined = useNavigationParam('orgId');

  const { body, description_markdown } = step;

  const handleAddStep = () => {
    dispatch(addStep(step, personId, orgId));
    dispatch(next({ personId, orgId }));
  };

  return (
    <StepDetailScreen
      CenterHeader={null}
      RightHeader={null}
      CenterContent={<View style={styles.centerContent} />}
      text={body}
      markdown={description_markdown}
      bottomButtonProps={{
        onPress: handleAddStep,
        text: t('addStep'),
      }}
    />
  );
};

const mapStateToProps = ({ onboarding }: { onboarding: OnboardingState }) => ({
  analyticsSection: getAnalyticsSectionType(onboarding),
});

export default connect(mapStateToProps)(SuggestedStepDetailScreen);
export const SUGGESTED_STEP_DETAIL_SCREEN = 'nav/SUGGESTED_STEP_DETAIL_SCREEN';
