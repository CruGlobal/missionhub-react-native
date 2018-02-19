import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import styles from './styles';

import { navigateBack } from '../../actions/navigation';
import { Button, Text, PlatformKeyboardAvoidingView, Flex, Input } from '../../components/common';
import theme from '../../theme';
import { STEP_NOTE } from '../../constants';
import { disableBack } from '../../utils/common';
import { BackButton } from '../BackButton';

@translate('addStep')
class AddStepScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      step: props.isEdit ? props.text : '',
    };

    this.saveStep = this.saveStep.bind(this);
    this.skip = this.skip.bind(this);
  }

  componentDidMount() {
    if (this.props.type === STEP_NOTE) {
      disableBack.add();
    }
  }

  componentWillUnmount() {
    if (this.props.type === STEP_NOTE) {
      disableBack.remove();
    }
  }

  saveStep() {
    Keyboard.dismiss();
    const text = this.state.step.trim();
    if (!text) {
      return;
    }
    if (this.props.type === STEP_NOTE) {
      disableBack.remove();
    }
    
    this.props.onComplete(text);
    if (this.props.type !== STEP_NOTE) {
      this.props.dispatch(navigateBack());
    }
  }

  skip() {
    Keyboard.dismiss();
    this.props.onComplete(null);
  }

  getButtonText() {
    const { t, type } = this.props;
    let text;
    if (type === 'journey' || type === STEP_NOTE) {
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
    if (type === 'journey' || type === STEP_NOTE) {
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
    const { t, type } = this.props;

    return (
      <PlatformKeyboardAvoidingView>
        {
          type === STEP_NOTE ? (
            <Flex align="end" justify="center">
              <Button
                type="transparent"
                onPress={this.skip}
                text={t('skip')}
                style={styles.skipBtn}
                buttonTextStyle={styles.skipBtnText}
              />
            </Flex>
          ) : null
        }
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
        {type !== STEP_NOTE ? <BackButton absolute={true} /> : null}
      </PlatformKeyboardAvoidingView>
    );
  }
}

AddStepScreen.propTypes = {
  onComplete: PropTypes.func.isRequired,
  type: PropTypes.oneOf([ 'journey', 'editJourney', STEP_NOTE ]),
  isEdit: PropTypes.bool,
  text: PropTypes.string,
};

const mapStateToProps = (reduxState, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(AddStepScreen);
export const ADD_STEP_SCREEN = 'nav/ADD_STEP';
