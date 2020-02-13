import React, { useState, useEffect } from 'react';
import { View, Keyboard, StatusBar, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import moment from 'moment';

import { Text, Input } from '../../components/common';
import DatePicker from '../../components/DatePicker';
import theme from '../../theme';
import BackButton from '../BackButton';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import Analytics from '../Analytics';

import styles from './styles';

interface ChallengeInterface {
  id: string;
  title: string;
  created_at: string;
  end_date: string;
  details_markdown?: string;
}

const AddChallengeScreen = () => {
  const { t } = useTranslation('addChallenge');
  const isEdit: boolean = useNavigationParam('isEdit');
  const onComplete: (challenge: {
    title: string;
    date: string;
    id: string;
    details?: string;
  }) => void = useNavigationParam('onComplete');
  const challenge: ChallengeInterface = useNavigationParam('challenge');
  const [title, changeTitle] = useState(isEdit ? challenge.title : '');
  const [detail, changeDetail] = useState(
    isEdit ? challenge.details_markdown : '',
  );
  const [date, changeDate] = useState(
    isEdit ? moment(challenge.end_date).endOf('day') : '',
  );
  const [isEditing, setEditing] = useState('');
  const [disableBtn, changeDisableBtn] = useState(true);

  useEffect(() => {
    date !== '' && title !== ''
      ? changeDisableBtn(false)
      : changeDisableBtn(true);
  }, [date, title, detail]);

  const {
    container,
    backButton,
    iconButton,
    textInput,
    dateWrap,
    dateLabel,
    dateInput,
    detailWrap,
    detailLabel,
    detailInput,
  } = styles;

  const onChangeTitle = (challengeTitle: string) => {
    changeTitle(challengeTitle);
    changeDisableBtn(!(title && date));
  };

  const onChangeDate = (challengeDate: string) => {
    if (!challengeDate) {
      changeDate('');
      changeDisableBtn(false);
    } else {
      changeDate(challengeDate);
      changeDisableBtn(!title);
    }
  };

  const saveChallenge = () => {
    Keyboard.dismiss();
    const formattedTitle = (title || '').trim();
    if (!formattedTitle || !date) {
      return;
    }
    const newChallenge = {
      title: formattedTitle,
      // @ts-ignore
      date: moment(new Date(date))
        .endOf('day')
        .format(),
      id: '',
      details: detail,
    };
    if (isEdit) {
      newChallenge.id = challenge.id;
    }
    onComplete(newChallenge);
  };

  const renderTitleInput = () => {
    return (
      <Input
        onChangeText={onChangeTitle}
        onFocus={() => setEditing('title')}
        onBlur={() => setEditing('')}
        value={title}
        autoFocus={true}
        autoCorrect={true}
        multiline={true}
        returnKeyType="done"
        blurOnSubmit={true}
        selectionColor={theme.secondaryColor}
        placeholder={t(isEdit ? 'titlePlaceholderEdit' : 'titlePlaceholderAdd')}
        placeholderTextColor={
          isEditing === 'title' ? theme.lightGrey : theme.challengeBlue
        }
        style={textInput}
      />
    );
  };

  const renderDateInput = () => {
    const today = new Date();
    return (
      <DatePicker
        // @ts-ignore
        date={date}
        mode="date"
        minDate={today}
        onDateChange={onChangeDate}
      >
        <View style={dateWrap}>
          <Text style={dateLabel}>{t('dateLabel')}</Text>
          <Text style={dateInput}>
            {!date ? t('datePlaceholder') : moment(date).format('LL')}
          </Text>
        </View>
      </DatePicker>
    );
  };

  const renderDetailInput = () => {
    return (
      <View style={detailWrap}>
        <Text style={detailLabel}>{t('detailsLabel')}</Text>
        <Input
          onChangeText={e => changeDetail(e)}
          onFocus={() => setEditing('detail')}
          onBlur={() => setEditing('')}
          value={detail}
          autoFocus={false}
          autoCorrect={true}
          multiline={true}
          returnKeyType="done"
          blurOnSubmit={true}
          selectionColor={theme.secondaryColor}
          placeholder={t('detailPlaceholder')}
          placeholderTextColor={
            isEditing === 'detail' ? theme.lightGrey : theme.challengeBlue
          }
          style={detailInput}
        />
      </View>
    );
  };

  return (
    <View style={container}>
      <Analytics screenName={['challenge', isEdit ? 'edit' : 'create']} />
      <StatusBar {...theme.statusBar.darkContent} />
      <Header
        right={
          <BackButton
            style={backButton}
            iconStyle={iconButton}
            customIcon={'deleteIcon'}
          />
        }
      />
      <ScrollView style={{ flex: 1 }}>
        {renderTitleInput()}
        {renderDateInput()}
        {renderDetailInput()}
      </ScrollView>
      <BottomButton
        disabled={disableBtn}
        onPress={saveChallenge}
        text={t(isEdit ? 'save' : 'add')}
      />
    </View>
  );
};

export default AddChallengeScreen;
export const ADD_CHALLENGE_SCREEN = 'nav/ADD_CHALLENGE';
