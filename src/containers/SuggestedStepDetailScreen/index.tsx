import React from 'react';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';

import { addStep } from '../../actions/steps';
import StepDetailScreen from '../../components/StepDetailScreen';
import { SuggestedStep } from '../../reducers/steps';

import styles from './styles';

interface SuggestedStepDetailScreenProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  next: (props: {
    personId: string;
    orgId: string | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => ThunkAction<void, any, {}, never>;
}

const SuggestedStepDetailScreen = ({
  dispatch,
  next,
}: SuggestedStepDetailScreenProps) => {
  const { t } = useTranslation('suggestedStepDetail');
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

const mapStateToProps = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _: any,
  {
    next,
  }: {
    next: (props: {
      personId: string;
      orgId: string | undefined;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) => ThunkAction<void, any, {}, never>;
  },
) => ({
  next,
});
export default connect(mapStateToProps)(SuggestedStepDetailScreen);
export const SUGGESTED_STEP_DETAIL_SCREEN = 'nav/SUGGESTED_STEP_DETAIL_SCREEN';