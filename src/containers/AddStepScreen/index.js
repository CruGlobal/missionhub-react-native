import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StatusBar, SafeAreaView, Keyboard, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { Flex, Input } from '../../components/common';
import theme from '../../theme';
import {
  JOURNEY,
  EDIT_JOURNEY_STEP,
  EDIT_JOURNEY_ITEM,
  STEP_NOTE,
  CREATE_STEP,
  INTERACTION,
} from '../../constants';
import { disableBack } from '../../utils/common';
import BackButton from '../BackButton';
import Skip from '../../components/Skip';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';

import styles from './styles';

const characterLimit = 255;

@withTranslation('addStep')
class AddStepScreen extends Component {
  state = {
    step: this.props.isEdit ? this.props.text : '',
  };

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
      id,
      type,
      personId,
      orgId,
      onSetComplete,
    } = this.props;
    if (onSetComplete) {
      await onSetComplete();
    }
    dispatch(next({ text, id, type, personId, orgId }));
  };

  saveStep = () => {
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
  };

  skip = () => {
    Keyboard.dismiss();

    this.next();
  };

  getButtonText() {
    const { t, type, personId, myId } = this.props;

    if ([JOURNEY, STEP_NOTE, INTERACTION].includes(type)) {
      return t(personId === myId ? 'addJourneyMe' : 'addJourneyPerson');
    }
    if ([EDIT_JOURNEY_STEP, EDIT_JOURNEY_ITEM].includes(type)) {
      return t('editJourneyButton');
    }
    return t('selectStep:addStep');
  }

  renderTitle() {
    const { t, type } = this.props;

    if ([JOURNEY, STEP_NOTE, INTERACTION].includes(type)) {
      return t('journeyHeader');
    }
    if ([EDIT_JOURNEY_STEP, EDIT_JOURNEY_ITEM].includes(type)) {
      return t('editJourneyHeader');
    }
    return t('header');
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
        <Header
          left={<BackButton iconStyle={backButtonStyle} />}
          right={
            type === STEP_NOTE || (type === INTERACTION && !hideSkip) ? (
              <Skip onSkip={this.skip} textStyle={skipBtnText} />
            ) : null
          }
          style={{ backgroundColor: undefined }}
        />
        <StatusBar {...theme.statusBar.darkContent} />
        <Flex value={1} align="stretch" justify="center" style={fieldWrap}>
          <Input
            testID="stepInput"
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
          />
        </Flex>
        <BottomButton
          onPress={this.saveStep}
          text={this.getButtonText()}
          testID="saveStepButton"
        />
      </SafeAreaView>
    );
  }
}

AddStepScreen.propTypes = {
  next: PropTypes.func.isRequired,
  type: PropTypes.oneOf([
    JOURNEY,
    EDIT_JOURNEY_STEP,
    EDIT_JOURNEY_ITEM,
    STEP_NOTE,
    CREATE_STEP,
    INTERACTION,
  ]),
  isEdit: PropTypes.bool,
  hideSkip: PropTypes.bool,
  text: PropTypes.string,
  id: PropTypes.string,
  personId: PropTypes.string,
  orgId: PropTypes.string,
  onSetComplete: PropTypes.func,
};

const mapStateToProps = (
  { auth },
  {
    navigation: {
      state: {
        params: {
          type,
          isEdit,
          hideSkip,
          text,
          id,
          personId,
          orgId,
          onSetComplete,
        },
      },
    },
    next,
  },
) => ({
  type,
  isEdit,
  hideSkip,
  text,
  id,
  personId,
  orgId,
  onSetComplete,
  next,
  myId: auth.person.id,
});

export default connect(mapStateToProps)(AddStepScreen);
export const ADD_STEP_SCREEN = 'nav/ADD_STEP';
export const COMPLETE_STEP_SCREEN = 'nav/COMPLETE_STEP';
