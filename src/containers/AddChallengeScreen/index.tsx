import React, { useState, useEffect } from 'react';
import {
  View,
  Keyboard,
  StatusBar,
  ScrollView,
  Image,
  Text,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import moment from 'moment';

import { Input, Button } from '../../components/common';
import DatePicker from '../../components/DatePicker';
import theme from '../../theme';
import BackButton from '../../components/BackButton';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import CloseButton from '../../components/CloseButton';
import CHALLENGE_TARGET from '../../../assets/images/challengeDetailsTarget.png';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { isAndroid } from '../../utils/common';

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
  const communityId: string = useNavigationParam('communityId');
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

  useAnalytics(['challenge', isEdit ? 'edit' : 'create'], {
    permissionType: { communityId },
  });

  const {
    container,
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

  const onChangeDate = (challengeDate: Date) => {
    if (!challengeDate) {
      changeDate('');
      changeDisableBtn(false);
    } else {
      changeDate(moment(challengeDate));
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
        testID="titleInput"
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
          isEditing === 'title' ? theme.lightGrey : theme.secondaryColor
        }
        style={textInput}
      />
    );
  };

  const renderDateInput = () => {
    const today = new Date();
    return (
      <DatePicker
        date={moment(date).toDate()}
        mode="date"
        minimumDate={today}
        onDateChange={onChangeDate}
        testID="datePicker"
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
          testID="detailInput"
          scrollEnabled={false}
          onChangeText={e => changeDetail(e)}
          onFocus={() => setEditing('detail')}
          onBlur={() => setEditing('')}
          value={detail}
          autoFocus={false}
          autoCorrect={true}
          multiline={true}
          selectionColor={theme.secondaryColor}
          placeholder={t('detailPlaceholder')}
          placeholderTextColor={
            isEditing === 'detail' ? theme.lightGrey : theme.secondaryColor
          }
          style={detailInput}
        />
      </View>
    );
  };

  return (
    <View style={container}>
      <StatusBar {...theme.statusBar.darkContent} />
      <Header
        left={isEdit ? <BackButton iconColor={theme.lightGrey} /> : null}
        right={
          isEdit ? (
            <Button
              type="transparent"
              testID="editButton"
              text={t('save').toUpperCase()}
              onPress={saveChallenge}
              buttonTextStyle={{ color: theme.secondaryColor, fontSize: 14 }}
              style={{ marginRight: 10 }}
            />
          ) : (
            <CloseButton style={styles.closeButton} />
          )
        }
      />
      <ScrollView
        contentContainerStyle={styles.fieldWrap}
        style={{ marginBottom: isAndroid ? 80 : undefined }}
        contentInset={{ bottom: 96 }}
      >
        {renderTitleInput()}
        {renderDateInput()}
        {renderDetailInput()}
      </ScrollView>
      <Image source={CHALLENGE_TARGET} style={styles.challengeImage} />
      {isEdit ? null : (
        <BottomButton
          testID="saveChallengeButton"
          style={disableBtn ? styles.disabledButton : null}
          disabled={disableBtn}
          onPress={saveChallenge}
          text={t('add')}
        />
      )}
    </View>
  );
};

export default AddChallengeScreen;
export const ADD_CHALLENGE_SCREEN = 'nav/ADD_CHALLENGE';
