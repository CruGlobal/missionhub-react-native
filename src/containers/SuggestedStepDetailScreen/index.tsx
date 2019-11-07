import React from 'react';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';

import { addStep } from '../../actions/steps';
import StepDetailScreen from '../../components/StepDetailScreen';
import { Step } from '../../reducers/steps';

import styles from './styles';

interface SuggestedStepDetailScreenProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  next: (props?: {
    contactId: string;
    orgId: string;
  }) => ThunkAction<void, any, {}, never>;
}

const SuggestedStepDetailScreen = ({
  dispatch,
  next,
}: SuggestedStepDetailScreenProps) => {
  const { t } = useTranslation('suggestedStepDetail');

  const step: Step = useNavigationParam('step');
  const receiverId: string = useNavigationParam('receiverId');
  const orgId: string = useNavigationParam('orgId');

  const { body, description_markdown } = step;

  const handleAddStep = () => {
    dispatch(addStep(step, receiverId, orgId));
    dispatch(next({ contactId: receiverId, orgId }));
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
  {},
  {
    next,
  }: {
    next: (props?: {
      contactId: string;
      orgId: string;
    }) => ThunkAction<void, any, null, never>;
  },
) => ({
  next,
});
export default connect(mapStateToProps)(SuggestedStepDetailScreen);
export const SUGGESTED_STEP_DETAIL_SCREEN = 'nav/SUGGESTED_STEP_DETAIL_SCREEN';
