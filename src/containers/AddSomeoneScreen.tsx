import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkAction } from 'redux-thunk';

import { TrackStateContext } from '../actions/analytics';
import { OnboardingState } from '../reducers/onboarding';
import { ANALYTICS_SECTION_TYPE } from '../constants';
import { useLogoutOnBack } from '../utils/hooks/useLogoutOnBack';
import { useAnalytics } from '../utils/hooks/useAnalytics';
import { getAnalyticsSectionType } from '../utils/common';

import IconMessageScreen from './IconMessageScreen';

interface AddSomeoneScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: (props?: { skip: boolean }) => ThunkAction<void, any, null, never>;
  analyticsSection: TrackStateContext[typeof ANALYTICS_SECTION_TYPE];
  hideSkipBtn?: boolean;
  enableBackButton?: boolean;
  logoutOnBack?: boolean;
}

const AddSomeoneScreen = ({
  next,
  analyticsSection,
  hideSkipBtn = false,
  enableBackButton = true,
  logoutOnBack = false,
}: AddSomeoneScreenProps) => {
  useAnalytics({
    screenName: ['onboarding', 'add someone'],
    screenContext: { [ANALYTICS_SECTION_TYPE]: analyticsSection },
  });
  const { t } = useTranslation('addContact');
  const dispatch = useDispatch();

  const handleBack = useLogoutOnBack(enableBackButton, logoutOnBack);

  const handleNavigate = (skip = false) => {
    dispatch(next({ skip }));
  };

  const skip = () => handleNavigate(true);

  return (
    <IconMessageScreen
      mainText={t('message')}
      onComplete={handleNavigate}
      buttonText={t('addSomeone')}
      iconPath={require('../../assets/images/add_someone.png')}
      onSkip={hideSkipBtn ? undefined : skip}
      onBack={handleBack}
    />
  );
};

const mapStateToProps = ({ onboarding }: { onboarding: OnboardingState }) => ({
  analyticsSection: getAnalyticsSectionType(onboarding),
});

export default connect(mapStateToProps)(AddSomeoneScreen);
export const ADD_SOMEONE_SCREEN = 'nav/ADD_SOMEONE';
