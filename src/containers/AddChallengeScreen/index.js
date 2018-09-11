import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Keyboard, Image } from 'react-native';
import moment from 'moment';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import CHALLENGE from '../../../assets/images/challenge_bullseye.png';
import { Button, Text, Flex, Input, Touchable } from '../../components/common';
import theme from '../../theme';
import { momentUtc } from '../../utils/common';
import BackButton from '../BackButton';

import styles from './styles';

// TODO: Setup translations
@translate('addChallenge')
class AddChallengeScreen extends Component {
  constructor(props) {
    super(props);

    const date = props.isEdit ? props.challenge.end_date : '';
    this.state = {
      challenge: props.isEdit ? props.challenge.title : '',
      date,
      formattedDate: date
        ? momentUtc(date).format('LL')
        : 'End Date (Required)',
      disableBtn: !props.isEdit,
    };
  }

  onChangeText = text => {
    this.setState({ challenge: text, disableBtn: text && this.state.date });
  };

  onChangeDate = date => {
    if (!date) {
      this.setState({
        date: '',
        formattedDate: 'End Date (Required)',
        disableBtn: false,
      });
    } else {
      this.setState({
        date: date,
        formattedDate: moment(date).format('LL'),
        disableBtn: !!this.state.text,
      });
    }
  };

  handleChooseDate = () => {
    console.log('choose date');
  };

  saveChallenge = () => {
    Keyboard.dismiss();
    const text = (this.state.step || '').trim();
    if (!text) {
      return;
    }

    this.props.onComplete(text);
  };

  getButtonText() {
    const { t, isEdit } = this.props;
    let text = isEdit ? t('editChallenge') : t('addChallenge');
    return text.toUpperCase();
  }

  getTitleText() {
    const { t, isEdit } = this.props;
    return isEdit ? t('editHeader') : t('addHeader');
  }

  ref = c => (this.challengeInput = c);

  render() {
    // const { t, type } = this.props;

    return (
      <View style={styles.container}>
        <Flex value={1.5} align="center" justify="center">
          <Image source={CHALLENGE} resizeMode="contain" />
          <Text type="header" style={styles.header}>
            {/* {this.getTitleText()} */}
            NEW CHALLENGE
          </Text>
        </Flex>

        <Flex value={1} style={styles.fieldWrap}>
          <Text style={styles.label}>Challenge</Text>
          <Input
            ref={this.ref}
            onChangeText={this.onChangeText}
            value={this.state.challenge}
            multiline={false}
            autoFocus={false}
            autoCorrect={true}
            selectionColor={theme.white}
            returnKeyType="next"
            blurOnSubmit={true}
            placeholder=""
          />
          <Text style={styles.label}>End Date</Text>
          <Touchable onPress={this.handleChooseDate}>
            <View style={styles.input}>
              <Text style={styles.dateInput}>{this.state.formattedDate}</Text>
            </View>
          </Touchable>
        </Flex>

        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={this.saveChallenge}
            text={this.getButtonText()}
            style={styles.createButton}
          />
        </Flex>
        <BackButton absolute={true} />
      </View>
    );
  }
}

AddChallengeScreen.propTypes = {
  onComplete: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  challenge: PropTypes.object,
};

const mapStateToProps = (reduxState, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(AddChallengeScreen);
export const ADD_CHALLENGE_SCREEN = 'nav/ADD_CHALLENGE';
