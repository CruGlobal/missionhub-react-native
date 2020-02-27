import React, { Component } from 'react';
import { connect } from 'react-redux-legacy';
import { View, Keyboard, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import moment from 'moment';

import { ANALYTICS_PERMISSION_TYPE } from '../../constants';
import { Text, Input } from '../../components/common';
import DatePicker from '../../components/DatePicker';
import theme from '../../theme';
import BackButton from '../BackButton';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import { getAnalyticsPermissionType } from '../../utils/common';
import { orgPermissionSelector } from '../../selectors/people';
import { AuthState } from '../../reducers/auth';
import Analytics from '../Analytics';

import styles from './styles';

// @ts-ignore
@withTranslation('addChallenge')
class AddChallengeScreen extends Component {
  state = {
    // @ts-ignore
    title: this.props.isEdit ? this.props.challenge.title : '',
    // @ts-ignore
    date: this.props.isEdit
      ? // prettier-ignore
        // @ts-ignore
        moment(this.props.challenge.end_date).endOf('day')
      : '',
    disableBtn: true,
  };

  // @ts-ignore
  onChangeTitle = title => {
    this.setState({ title, disableBtn: !(title && this.state.date) });
  };

  // @ts-ignore
  onChangeDate = date => {
    if (!date) {
      this.setState({ date: '', disableBtn: false });
    } else {
      this.setState({ date, disableBtn: !this.state.title });
    }
  };

  saveChallenge = () => {
    Keyboard.dismiss();
    // @ts-ignore
    const { challenge, isEdit } = this.props;
    const { title, date } = this.state;
    const formattedTitle = (title || '').trim();
    if (!formattedTitle || !date) {
      return;
    }
    const newChallenge = {
      title: formattedTitle,
      // Set the date to the end of the day (11:59 PM) so that the challenge ends at the end of the day
      // @ts-ignore
      date: moment(new Date(date))
        .endOf('day')
        .format(),
    };
    if (isEdit) {
      // @ts-ignore
      newChallenge.id = challenge.id;
    }

    // @ts-ignore
    this.props.onComplete(newChallenge);
  };

  renderTitleInput() {
    // @ts-ignore
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
    // @ts-ignore
    const { t } = this.props;
    const { date } = this.state;
    const { dateWrap, dateLabel, dateInput } = styles;

    const today = new Date();

    return (
      <DatePicker
        // @ts-ignore
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
    // @ts-ignore
    const { t, isEdit, analyticsPermissionType } = this.props;
    const { disableBtn } = this.state;
    const { container, backButton } = styles;

    return (
      <View style={container}>
        <Analytics
          screenName={['challenge', isEdit ? 'edit' : 'create']}
          screenContext={{
            [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType,
          }}
        />
        <StatusBar {...theme.statusBar.darkContent} />
        <Header left={<BackButton iconStyle={backButton} />} />
        <View style={{ flex: 1 }}>
          {this.renderTitleInput()}
          {this.renderDateInput()}
        </View>
        <BottomButton
          disabled={disableBtn}
          onPress={this.saveChallenge}
          text={t(isEdit ? 'save' : 'add')}
        />
      </View>
    );
  }
}

// @ts-ignore
AddChallengeScreen.propTypes = {
  onComplete: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  challenge: PropTypes.object,
};

const mapStateToProps = (
  { auth }: { auth: AuthState },
  {
    navigation,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
) => {
  const { organization } = navigation.state.params;

  return {
    ...(navigation.state.params || {}),
    analyticsPermissionType: getAnalyticsPermissionType(
      orgPermissionSelector({}, { person: auth.person, organization }),
    ),
  };
};

export default connect(mapStateToProps)(AddChallengeScreen);
export const ADD_CHALLENGE_SCREEN = 'nav/ADD_CHALLENGE';
