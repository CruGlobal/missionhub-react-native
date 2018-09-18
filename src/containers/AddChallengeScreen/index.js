import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Keyboard, Image } from 'react-native';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import moment from 'moment';

import CHALLENGE from '../../../assets/images/challenge_bullseye.png';
import { Button, Text, Flex, Input } from '../../components/common';
import DatePicker from '../../components/DatePicker';
import theme from '../../theme';
import BackButton from '../BackButton';

import styles from './styles';

@translate('addChallenge')
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

    this.today = new Date();
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

  render() {
    const { t, isEdit } = this.props;
    const { disableBtn, title, date } = this.state;

    return (
      <View style={styles.container}>
        <Flex
          value={0.9}
          align="center"
          justify="center"
          style={styles.imageWrap}
        >
          <Image source={CHALLENGE} resizeMode="contain" />
          <Text type="header" style={styles.header}>
            {isEdit ? t('editHeader') : t('addHeader')}
          </Text>
        </Flex>

        <Flex value={1} style={styles.fieldWrap}>
          <Text style={styles.label}>{t('titleLabel')}</Text>
          <Input
            onChangeText={this.onChangeTitle}
            value={title}
            autoFocus={false}
            autoCorrect={true}
            selectionColor={theme.white}
            returnKeyType="done"
            blurOnSubmit={true}
            placeholder={t('titlePlaceholder')}
            placeholderTextColor={theme.white}
          />
          <Text style={styles.label}>{t('dateLabel')}</Text>
          <DatePicker
            date={date}
            mode="date"
            placeholder={t('datePlaceholder')}
            minDate={this.today}
            onDateChange={this.onChangeDate}
          />
        </Flex>

        <Flex value={1} align="stretch" justify="end">
          <Button
            disabled={disableBtn}
            type="secondary"
            onPress={this.saveChallenge}
            text={(isEdit ? t('save') : t('add')).toUpperCase()}
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
