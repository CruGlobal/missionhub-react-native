import React, { Component } from 'react';
import { Keyboard, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { keyLogin } from '../../../actions/auth/key';
import { MFA_REQUIRED } from '../../../constants';
import MFACodeComponent from '../../../components/MFACodeComponent';

@withTranslation('mfaLogin')
class MFACodeScreen extends Component {
  state = {
    mfaCode: '',
    isLoading: false,
  };

  mfaCodeChanged = mfaCode => {
    this.setState({ mfaCode });
  };

  completeMfa = async () => {
    const { email, password, next, dispatch, t } = this.props;
    const { mfaCode } = this.state;

    this.setState({ isLoading: true });

    try {
      await dispatch(keyLogin(email, password, mfaCode));
      Keyboard.dismiss();
      dispatch(next());
    } catch (error) {
      this.setState({ isLoading: false });

      if (error && error.apiError['thekey_authn_error'] === MFA_REQUIRED) {
        Alert.alert(t('mfaIncorrect'));
        return;
      }

      throw error;
    }
  };

  render() {
    const { mfaCode, isLoading } = this.state;

    return (
      <MFACodeComponent
        onChangeText={this.mfaCodeChanged}
        value={mfaCode}
        onSubmit={this.completeMfa}
        isLoading={isLoading}
      />
    );
  }
}

MFACodeScreen.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  next: PropTypes.func.isRequired,
};

const mapStateToProps = (_, { navigation }) => {
  const { email, password } = navigation.state.params || {};

  return { email, password };
};

export default connect(mapStateToProps)(MFACodeScreen);
export const MFA_CODE_SCREEN = 'nav/MFA_SCREEN';
