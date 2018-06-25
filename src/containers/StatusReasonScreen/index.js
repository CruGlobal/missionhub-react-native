import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Flex, Text, Button, Input } from '../../components/common';
import Header from '../Header';
import BackButton from '../BackButton';
import theme from '../../theme';

import styles from './styles';

@translate('statusReason')
class StatusReasonScreen extends Component {
  state = { text: '' };

  handleChangeText = t => {
    this.setState({ text: t });
  };

  cancel = () => {
    return false;
  };

  complete = () => {
    return false;
  };

  submit = () => {
    const { text } = this.state;
    if (!text) {
      // No reason filled in
      return;
    }
    // TODO: Add a reason to the status change
  };

  render() {
    const { t, organization } = this.props;

    return (
      <View style={styles.container}>
        <Header
          left={<BackButton />}
          right={
            <Button
              text={t('done').toUpperCase()}
              type="transparent"
              onPress={this.submit}
              style={styles.headerButton}
              buttonTextStyle={styles.headerButtonText}
            />
          }
          shadow={false}
        />

        <Flex value={1} align="stretch" style={styles.content}>
          <Text style={styles.text}>
            {t('important', { organization: organization.name })}
          </Text>
          <Input
            onChangeText={this.handleChangeText}
            placeholder={t('placeholder')}
            placeholderTextColor={theme.white}
            value={this.state.text}
            style={styles.input}
            blurOnSubmit={true}
            autoCorrect={true}
          />
        </Flex>
      </View>
    );
  }
}

StatusReasonScreen.propTypes = {
  person: PropTypes.object.isRequired,
};

const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  me: auth.person,
});

export default connect(mapStateToProps)(StatusReasonScreen);
export const STATUS_REASON_SCREEN = 'nav/STATUS_REASON';
