import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Keyboard, Image } from 'react-native';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import CHALLENGE from '../../../assets/images/challenge_bullseye.png';
import { Button, Text, Flex, Input } from '../../components/common';
import DatePicker from '../../components/DatePicker';
import theme from '../../theme';
import { formatApiDate } from '../../utils/common';
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
      disableBtn: !isEdit,
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
    const { title, date } = this.state;
    const formattedTitle = (title || '').trim();
    if (!formattedTitle || !date) {
      return;
    }
    const challenge = {
      title: formattedTitle,
      date: formatApiDate(new Date(date)),
    };
    console.log('challenge', challenge);

    this.props.onComplete(challenge);
  };

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
