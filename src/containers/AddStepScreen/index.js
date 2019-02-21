import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Keyboard, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { navigateBack } from '../../actions/navigation';
import { updateChallengeNote } from '../../actions/steps';
import { trackAction } from '../../actions/analytics';
import { Button, Text, Flex, Input, SafeView } from '../../components/common';
import theme from '../../theme';
import { STEP_NOTE, CREATE_STEP, ACTIONS } from '../../constants';
import { disableBack } from '../../utils/common';
import BackButton from '../BackButton';
import AbsoluteSkip from '../../components/AbsoluteSkip';

import styles from './styles';

const characterLimit = 255;

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

  onChangeText = text => {
    const { t, type } = this.props;

    this.setState({ step: text });

    if (type === CREATE_STEP && text.length >= characterLimit) {
      Alert.alert('', t('makeShorter'));
    }
  };
  saveStep() {
    const {
      type,
      dispatch,
      next,
      onComplete,
      stepId,
      personId,
      orgId,
    } = this.props;
    Keyboard.dismiss();

    const text = (this.state.step || '').trim();
    if (!text) {
      return;
    }
    if (type === STEP_NOTE) {
      disableBack.remove();

      if (next) {
        if (text) {
          dispatch(updateChallengeNote(stepId, text));
          dispatch(
            trackAction(ACTIONS.INTERACTION.name, {
              [ACTIONS.INTERACTION.COMMENT]: null,
            }),
          );
        }

        return dispatch(next({ personId, orgId }));
      }
    }

    onComplete(text);

    if (type !== STEP_NOTE) {
      dispatch(navigateBack());
    }
  }

  skip() {
    const { type, dispatch, next, onComplete, personId, orgId } = this.props;
    Keyboard.dismiss();

    if (type === STEP_NOTE && next) {
      return dispatch(next({ personId, orgId }));
    }

    onComplete(null);
    if (type === 'interaction') {
      dispatch(navigateBack());
    }
  }

  getButtonText() {
    const { t, type } = this.props;
    let text = t('createStep');
    if (type === 'journey' || type === STEP_NOTE || type === 'interaction') {
      text = t('addJourney');
    } else if (type === 'editJourney') {
      text = t('editJourneyButton');
    }

    return text.toUpperCase();
  }

  renderTitle() {
    const { t, type } = this.props;
    let text = t('header');
    let style = styles.header;
    if (type === 'journey' || type === STEP_NOTE || type === 'interaction') {
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

  ref = c => (this.stepInput = c);

  render() {
    const { type, hideSkip } = this.props;

    return (
      <SafeView style={styles.container}>
        <Flex value={1.5} align="center" justify="center">
          {this.renderTitle()}
        </Flex>

        <Flex value={1} style={styles.fieldWrap}>
          <Input
            ref={this.ref}
            onChangeText={this.onChangeText}
            value={this.state.step}
            multiline={true}
            autoFocus={true}
            autoCorrect={true}
            selectionColor={theme.white}
            returnKeyType="done"
            blurOnSubmit={true}
            placeholder=""
            maxLength={type === CREATE_STEP ? characterLimit : undefined}
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
        {type === STEP_NOTE || (type === 'interaction' && !hideSkip) ? (
          <AbsoluteSkip onSkip={this.skip} />
        ) : null}
      </SafeView>
    );
  }
}

AddStepScreen.propTypes = {
  next: PropTypes.func,
  onComplete: PropTypes.func,
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
};

const mapStateToProps = (reduxState, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(AddStepScreen);
export const ADD_STEP_SCREEN = 'nav/ADD_STEP';
