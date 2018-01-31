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
      step: props.isEdit ? props.text : '',
    };

    this.saveStep = this.saveStep.bind(this);
  }

  saveStep() {
    Keyboard.dismiss();
    const text = this.state.step.trim();
    if (!text) {
      return;
    }
    this.props.onComplete(text);
    this.props.dispatch(navigateBack());
  }

  getButtonText() {
    const { t, type } = this.props;
    let text;
    if (type === 'journey') {
      text = t('addJourney');
    } else if (type === 'editJourney') {
      text = t('editJourneyButton');
    } else {
      text = t('createStep');
    }
    return text.toUpperCase();
  }

  renderTitle() {
    const { t, type } = this.props;
    let text = t('header');
    let style = styles.header;
    if (type === 'journey') {
      style = styles.journeyHeader;
      text = t('journeyHeader');
    } else if (type === 'editJourney') {
      style = styles.journeyHeader;
      text = t('editJourneyHeader');
    }
    return (
      <Text type="header" style={style}>
        {text}
      </Text>
    );
  }

  render() {
    return (
      <PlatformKeyboardAvoidingView>
        <BackButton />
        <Flex value={1.5} align="center" justify="center">
          {this.renderTitle()}
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
            text={this.getButtonText()}
            style={styles.createButton}
          />
        </Flex>
      </PlatformKeyboardAvoidingView>
    );
  }
}

AddStepScreen.propTypes = {
  onComplete: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['journey', 'editJourney']),
  isEdit: PropTypes.bool,
  text: PropTypes.string,
};

const mapStateToProps = (reduxState, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(AddStepScreen);
