import React, { useState } from 'react';
import { Keyboard, Alert } from 'react-native';
import { useNavigationParam } from 'react-navigation-hooks';
import { connect } from 'react-redux-legacy';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { useTranslation } from 'react-i18next';

import { keyLogin } from '../../../actions/auth/key';
import { MFA_REQUIRED } from '../../../constants';
import { MFACodeComponent } from '../../../components/MFACodeComponent';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

const MFACodeScreen = ({
  dispatch,
  next,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: () => ThunkAction<void, any, null, never>;
}) => {
  useAnalytics({ screenName: ['sign in', 'verification'] });
  const { t } = useTranslation('mfaLogin');
  const email: string = useNavigationParam('email');
  const password: string = useNavigationParam('password');

  const [mfaCode, setMfaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const completeMfa = async () => {
    setIsLoading(true);

    try {
      await dispatch(keyLogin(email, password, mfaCode));
      Keyboard.dismiss();
      dispatch(next());
    } catch (error) {
      setIsLoading(false);

      if (error && error.apiError['thekey_authn_error'] === MFA_REQUIRED) {
        Alert.alert(t('mfaIncorrect'));
        return;
      }

      throw error;
    }
  };

  return (
    <MFACodeComponent
      testID="MFACodeComponent"
      onChangeText={setMfaCode}
      value={mfaCode}
      onSubmit={completeMfa}
      isLoading={isLoading}
    />
  );
};

export default connect()(MFACodeScreen);
export const MFA_CODE_SCREEN = 'nav/MFA_SCREEN';
