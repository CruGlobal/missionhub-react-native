import React, { Component } from 'react';
import { Keyboard, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { keyLogin } from '../../actions/auth';
import { MFA_REQUIRED } from '../../constants';
import MFACodeComponent from '../../components/MFACodeComponent';
import { screenFlowNext } from '../../actions/screenFlow';

@translate('mfaLogin')
class MFACodeScreen extends Component {
  state = {
    mfaCode: '',
    isLoading: false,
  };

  mfaCodeChanged = mfaCode => {
    this.setState({ mfaCode });
  };

  completeMfa = async () => {
    const { email, password, upgradeAccount } = this.props;
    const { dispatch, t } = this.props;

    this.setState({ isLoading: true });

    try {
      const mePerson = await dispatch(
        keyLogin(email, password, this.state.mfaCode, upgradeAccount),
      );
      Keyboard.dismiss();
      dispatch(screenFlowNext({ mePerson }));
    } catch (error) {
      if (error && error.apiError['thekey_authn_error'] === MFA_REQUIRED) {
        Alert.alert(t('mfaIncorrect'));
        return;
      }

      throw error;
    } finally {
      this.setState({ isLoading: false });
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
};

const mapStateToProps = (_, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(MFACodeScreen);
export const MFA_CODE_SCREEN = 'nav/MFA_SCREEN';
