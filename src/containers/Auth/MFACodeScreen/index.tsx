import React, { useState } from 'react';
import { Keyboard } from 'react-native';
import { useNavigationParam } from 'react-navigation-hooks';
import { connect } from 'react-redux-legacy';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import { MFACodeComponent } from '../../../components/MFACodeComponent';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { RootState } from '../../../reducers';
import { useAuth } from '../../../auth/useAuth';
import { SignInWithTheKeyType } from '../../../auth/providers/useSignInWithTheKey';
import { IdentityProvider } from '../../../auth/constants';

const MFACodeScreen = ({
  dispatch,
  next,
}: {
  dispatch: ThunkDispatch<RootState, never, AnyAction>;
  next: () => ThunkAction<void, RootState, never, AnyAction>;
}) => {
  useAnalytics(['sign in', 'verification']);
  const email: string = useNavigationParam('email');
  const password: string = useNavigationParam('password');
  const { authenticate, loading, error } = useAuth();

  const [mfaCode, setMfaCode] = useState('');

  const completeMfa = async () => {
    try {
      await authenticate({
        provider: IdentityProvider.TheKey,
        theKeyOptions: {
          type: SignInWithTheKeyType.EmailPassword,
          email,
          password,
          mfaCode,
        },
      });
      dispatch(next());
      Keyboard.dismiss();
    } catch {}
  };

  return (
    <MFACodeComponent
      testID="MFACodeComponent"
      onChangeText={setMfaCode}
      value={mfaCode}
      onSubmit={completeMfa}
      loading={loading}
      error={error}
    />
  );
};

export default connect()(MFACodeScreen);
export const MFA_CODE_SCREEN = 'nav/MFA_SCREEN';
