import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Keyboard, Image } from 'react-native';
import moment from 'moment';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import CHALLENGE from '../../../assets/images/challenge_bullseye.png';
import { Button, Text, Flex, Input, Touchable } from '../../components/common';
import DatePicker from '../../components/DatePicker';
import theme from '../../theme';
import { momentUtc, formatApiDate } from '../../utils/common';
import BackButton from '../BackButton';

import styles from './styles';

// TODO: Setup translations
@translate('addChallenge')
class AddChallengeScreen extends Component {
  constructor(props) {
    super(props);
    const { isEdit, challenge } = props;

    const date = isEdit ? challenge.end_date : '';
    this.state = {
      title: isEdit ? challenge.title : '',
      date,
      formattedDate: date ? momentUtc(date).format('LL') : '',
      disableBtn: !isEdit,
    };
  }

  onChangeTitle = title => {
    this.setState({ title, disableBtn: !!(title && this.state.date) });
  };

  onChangeDate = date => {
    if (!date) {
      this.setState({
        date: '',
        formattedDate: '',
        disableBtn: false,
      });
    } else {
      this.setState({
        date: date,
        formattedDate: moment(date).format('LL'),
        disableBtn: !!this.state.title,
      });
    }
  };

  saveChallenge = () => {
    Keyboard.dismiss();
    const { title, date } = this.state;
    const formattedTitle = (title || '').trim();
    if (!formattedTitle || !date) {
      return;
    }
    const challenge = {
      title: formattedTitle,
      date: formatApiDate(date),
    };

    this.props.onComplete(challenge);
  };

  getButtonText() {
    const { t, isEdit } = this.props;
    let text = isEdit ? t('editChallenge') : t('addChallenge');
    return text.toUpperCase();
  }

  ref = c => (this.challengeInput = c);

  render() {
    const { t, isEdit } = this.props;
    const { disableBtn, title, date } = this.state;

    return (
      <View style={styles.container}>
        <Flex value={1} align="center" justify="center">
          <Image source={CHALLENGE} resizeMode="contain" />
          <Text type="header" style={styles.header}>
            {isEdit ? t('editHeader') : t('addHeader')}
          </Text>
        </Flex>

        <Flex value={1} style={styles.fieldWrap}>
          <Text style={styles.label}>{t('titleLabel')}</Text>
          <Input
            ref={this.ref}
            onChangeText={this.onChangeTitle}
            value={title}
            autoFocus={false}
            autoCorrect={true}
            selectionColor={theme.white}
            returnKeyType="next"
            blurOnSubmit={true}
            placeholder={t('titlePlaceholder')}
            placeholderTextColor={theme.white}
          />
          <Text style={styles.label}>{t('dateLabel')}</Text>
          {/* <Touchable onPress={this.handleChooseDate}>
            <View style={styles.input}>
              <Text style={styles.dateInput}>
                {formattedDate || t('datePlaceholder')}
              </Text>
            </View>
          </Touchable> */}
          <DatePicker
            date={date}
            mode="date"
            placeholder={t('datePlaceholder')}
            format="YYYY-MM-DD"
            minDate="2018-09-12"
            onDateChange={this.onChangeDate}
          />
        </Flex>

        <Flex value={1} align="stretch" justify="end">
          <Button
            disabled={disableBtn}
            type="secondary"
            onPress={this.saveChallenge}
            text={this.getButtonText()}
            style={styles.createButton}
          />
        </Flex>
        <BackButton customIcon="deleteIcon" absolute={true} />
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
