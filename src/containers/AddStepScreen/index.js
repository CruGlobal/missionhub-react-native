import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import styles from './styles';

import { navigateBack } from '../../actions/navigation';
import { Button, Text, PlatformKeyboardAvoidingView, Flex } from '../../components/common';
import Input from '../../components/Input/index';
import BackButton from '../BackButton';
import theme from '../../theme';

@translate('addStep')
class AddStepScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      step: '',
    };

    this.saveStep = this.saveStep.bind(this);
  }

  saveStep() {
    Keyboard.dismiss();
    const text = this.state.step.trim();
    if (!text) {
      return;
    }
    // TODO: Save to my steps
    this.props.onComplete(text);
    this.props.dispatch(navigateBack());
  }

  render() {
    const { t, type } = this.props;

    return (
      <PlatformKeyboardAvoidingView>
        <BackButton />
        <Flex value={1.5} align="center" justify="center">
          <Text type="header" style={type ? styles.journeyHeader : styles.header}>
            {type && type === 'journey' ? t('journeyHeader') : t('header')}
          </Text>
        </Flex>

        <Flex value={1} style={styles.fieldWrap}>
          <Input
            ref={(c) => this.stepInput = c}
            onChangeText={(t) => this.setState({ step: t })}
            value={this.state.step}
            multiline={true}
            autoFocus={true}
            selectionColor={theme.white}
            returnKeyType="done"
            blurOnSubmit={true}
            placeholder=""
          />
        </Flex>

        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={this.saveStep}
            text={type && type === 'journey' ? t('addJourney').toUpperCase() : t('createStep').toUpperCase()}
            style={styles.createButton}
          />
        </Flex>
      </PlatformKeyboardAvoidingView>
    );
  }
}

AddStepScreen.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

const mapStateToProps = (reduxState, { navigation }) => ({
  onComplete: navigation.state.params.onComplete,
  type: navigation.state.params.type,
});

export default connect(mapStateToProps)(AddStepScreen);
