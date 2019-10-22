import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import BottomButton from '../../components/BottomButton';
import { navigateToMainTabs } from '../../actions/navigation';
import { PEOPLE_TAB } from '../../constants';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, any>;
}

const TakeAStepWithSomeoneButton = (props: Props) => {
  const { t } = useTranslation();
  function navigateToAddSomeoneScreen() {
    props.dispatch(navigateToMainTabs(PEOPLE_TAB));
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
