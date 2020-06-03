import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux-legacy';
import { ThunkDispatch } from 'redux-thunk';

import { Button } from '../common';
import { assignContactAndPickStage } from '../../actions/misc';

import styles from './styles';

interface AssignToMeButtonProps {
  person: object;
  onComplete?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
}

const AssignToMeButton = ({
  dispatch,
  person,
  onComplete,
}: AssignToMeButtonProps) => {
  const { t } = useTranslation();

  const assignToMe = async () => {
    await dispatch(assignContactAndPickStage(person));
    onComplete && onComplete();
  };
  return (
    <Button
      testID="AssignToMeButton"
      type="transparent"
      onPress={assignToMe}
      text={t('assignToMe').toUpperCase()}
      style={styles.assignButton}
      buttonTextStyle={styles.assignButtonText}
    />
  );
};

export default connect()(AssignToMeButton);
