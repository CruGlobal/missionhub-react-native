import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StatusBar, SafeAreaView, Keyboard, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { Flex, Input } from '../../components/common';
import theme from '../../theme';
import { STEP_NOTE, CREATE_STEP } from '../../constants';
import { disableBack } from '../../utils/common';
import BackButton from '../BackButton';
import AbsoluteSkip from '../../components/AbsoluteSkip';
import BottomButton from '../../components/BottomButton';

import styles from './styles';

const characterLimit = 255;

@withTranslation('addStep')
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

  onChangeText = text => {
    const { t, type } = this.props;

    this.setState({ step: text });

    if (type === CREATE_STEP && text.length >= characterLimit) {
      Alert.alert('', t('makeShorter'));
    }
  };

  next = async text => {
    const {
      next,
      dispatch,
      stepId,
      personId,
      orgId,
      onSetComplete,
    } = this.props;
    if (onSetComplete) {
      await onSetComplete();
    }
    dispatch(next({ text, stepId, personId, orgId }));
  };

  saveStep() {
    const { type } = this.props;
    Keyboard.dismiss();

    const text = (this.state.step || '').trim();
    if (!text) {
      return;
    }
    if (type === STEP_NOTE) {
      disableBack.remove();
    }

    this.next(text);
  }

  skip() {
    Keyboard.dismiss();

    this.next();
  }

  getButtonText() {
    const { t, type, personId, myId } = this.props;
    let text = t('selectStep:addStep');
    if (type === 'journey' || type === STEP_NOTE || type === 'interaction') {
      text = t(personId === myId ? 'addJourneyMe' : 'addJourneyPerson');
    } else if (type === 'editJourney') {
      text = t('editJourneyButton');
    }

    return text;
  }

  renderTitle() {
    const { t, type } = this.props;

    return t(
      type === 'journey' || type === STEP_NOTE || type === 'interaction'
        ? 'journeyHeader'
        : type === 'editJourney'
        ? 'editJourneyHeader'
        : 'header',
    );
  }

  ref = c => (this.stepInput = c);

  render() {
    const { type, hideSkip } = this.props;
    const { lightGrey } = theme;
    const {
      backButtonStyle,
      input,
      container,
      fieldWrap,
      skipBtnText,
    } = styles;

    return (
      <SafeAreaView style={container}>
        <StatusBar {...theme.statusBar.darkContent} />
        <Flex value={1} align="stretch" justify="center" style={fieldWrap}>
          <Input
            style={input}
            ref={this.ref}
            onChangeText={this.onChangeText}
            value={this.state.step}
            multiline={true}
            textAlignVertical="top"
            autoFocus={true}
            autoCorrect={true}
            returnKeyType="done"
            blurOnSubmit={true}
            placeholder={this.renderTitle()}
            placeholderTextColor={lightGrey}
            maxLength={type === CREATE_STEP ? characterLimit : undefined}
            testID="stepInput"
          />
        </Flex>
        <BottomButton
          onPress={this.saveStep}
          text={this.getButtonText()}
          testID="saveStepButton"
        />
        <BackButton absolute={true} iconStyle={backButtonStyle} />
        {type === STEP_NOTE || (type === 'interaction' && !hideSkip) ? (
          <AbsoluteSkip onSkip={this.skip} textStyle={skipBtnText} />
        ) : null}
      </SafeAreaView>
    );
  }
}

AddStepScreen.propTypes = {
  next: PropTypes.func.isRequired,
  type: PropTypes.oneOf([
    'journey',
    'editJourney',
    STEP_NOTE,
    CREATE_STEP,
    'interaction',
  ]),
  isEdit: PropTypes.bool,
  hideSkip: PropTypes.bool,
  text: PropTypes.string,
  stepId: PropTypes.string,
  personId: PropTypes.string,
  orgId: PropTypes.string,
  onSetComplete: PropTypes.func,
};

const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  myId: auth.person.id,
});

export default connect(mapStateToProps)(AddStepScreen);
export const ADD_STEP_SCREEN = 'nav/ADD_STEP';
export const COMPLETE_STEP_SCREEN = 'nav/COMPLETE_STEP';
