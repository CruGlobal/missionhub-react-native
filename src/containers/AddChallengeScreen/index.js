import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, View, Keyboard, Image, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import moment from 'moment';

import CHALLENGE from '../../../assets/images/challenge_bullseye.png';
import { Text, Input } from '../../components/common';
import DatePicker from '../../components/DatePicker';
import theme from '../../theme';
import BackButton from '../BackButton';
import BottomButton from '../../components/BottomButton';

import styles from './styles';

@withTranslation('addChallenge')
class AddChallengeScreen extends Component {
  constructor(props) {
    super(props);
    const { isEdit, challenge } = props;

    const date = isEdit ? moment(challenge.end_date).endOf('day') : '';
    this.state = {
      title: isEdit ? challenge.title : '',
      date,
      disableBtn: true,
    };
  }

  onChangeTitle = title => {
    this.setState({ title, disableBtn: !(title && this.state.date) });
  };

  onChangeDate = date => {
    if (!date) {
      this.setState({ date: '', disableBtn: false });
    } else {
      this.setState({ date, disableBtn: !this.state.title });
    }
  };

  saveChallenge = () => {
    Keyboard.dismiss();
    const { challenge, isEdit } = this.props;
    const { title, date } = this.state;
    const formattedTitle = (title || '').trim();
    if (!formattedTitle || !date) {
      return;
    }
    const newChallenge = {
      title: formattedTitle,
      // Set the date to the end of the day (11:59 PM) so that the challenge ends at the end of the day
      date: moment(new Date(date))
        .endOf('day')
        .format(),
    };
    if (isEdit) {
      newChallenge.id = challenge.id;
    }

    this.props.onComplete(newChallenge);
  };

  renderTitleInput() {
    const { t, isEdit } = this.props;
    const { title } = this.state;
    const { textInput } = styles;

    return (
      <Input
        onChangeText={this.onChangeTitle}
        value={title}
        autoFocus={false}
        autoCorrect={true}
        multiline={true}
        returnKeyType="done"
        blurOnSubmit={true}
        selectionColor={theme.secondaryColor}
        placeholder={t(isEdit ? 'titlePlaceholderEdit' : 'titlePlaceholderAdd')}
        placeholderTextColor={theme.lightGrey}
        style={textInput}
      />
    );
  }

  renderDateInput() {
    const { t, disabled } = this.props;
    const { date } = this.state;
    const { dateWrap, dateLabel, dateInput } = styles;

    const today = new Date();

    return (
      <DatePicker
        date={date}
        mode="date"
        minDate={today}
        onDateChange={this.onChangeDate}
      >
        <View style={dateWrap}>
          <Text style={dateLabel}>{t('dateLabel')}</Text>
          <Text style={dateInput}>
            {!date ? t('datePlaceholder') : moment(date).format('LL')}
          </Text>
        </View>
      </DatePicker>
    );
  }

  render() {
    const { t, isEdit } = this.props;
    const { disableBtn, title, date } = this.state;
    const { container, backButton } = styles;

    return (
      <SafeAreaView style={container}>
        <StatusBar {...theme.statusBar.darkContent} />
        <View flex={1}>
          {this.renderTitleInput()}
          {this.renderDateInput()}
        </View>
        <BottomButton
          disabled={disableBtn}
          onPress={this.saveChallenge}
          text={t(isEdit ? 'save' : 'add')}
        />
        <BackButton iconStyle={backButton} absolute={true} />
      </SafeAreaView>
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
