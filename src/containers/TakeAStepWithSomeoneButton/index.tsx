import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import { ADD_SOMEONE_STEP_FLOW } from '../../routes/constants';
import BottomButton from '../../components/BottomButton';
import { navigatePush } from '../../actions/navigation';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, any>;
}

const TakeAStepWithSomeoneButton = (props: Props) => {
  const { t } = useTranslation();
  function navigateToAddSomeoneScreen() {
    props.dispatch(navigatePush(ADD_SOMEONE_STEP_FLOW));
  }
  return (
    <BottomButton
      text={t('mainTabs:takeAStepWithSomeone')}
      onPress={navigateToAddSomeoneScreen}
      testID="TakeAStepWithSomeoneButton"
    />
  );
};

export default connect()(TakeAStepWithSomeoneButton);
