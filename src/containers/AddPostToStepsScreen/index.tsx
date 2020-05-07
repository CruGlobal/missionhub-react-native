import React from 'react';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { ScrollView } from 'react-native';

import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { navigateBack } from '../../actions/navigation';
import Header from '../../components/Header';
import { Button, Flex, Text, Separator } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import CardTime from '../../components/CardTime';
import CloseIcon from '../../../assets/images/closeButton.svg';
import PrayerIcon from '../../../assets/images/prayerRequestIcon.svg';
import ShareIcon from '../../../assets/images/onYourMindIcon.svg';
import CareIcon from '../../../assets/images/careRequestIcon.svg';
import Avatar from '../../components/Avatar';
import { PostTypeEnum } from '../../../__generated__/globalTypes';
import styles from './styles';

import theme from '../../theme';

const AddPostToStepsScreen = () => {
  const { t } = useTranslation('addPostToStepsScreen');
  const dispatch = useDispatch();
  const item = useNavigationParam('item');
  const person = item.subjectPerson;

  useAnalytics(['add steps', 'step detail']);

  const onClose = () => {
    dispatch(navigateBack());
  };

  const getIcon = () => {
    switch (item.subject.postType) {
      case PostTypeEnum.prayer_request:
        return <PrayerIcon color={theme.communityThoughtGrey} />;
      case PostTypeEnum.thought:
        return <ShareIcon color={theme.communityThoughtGrey} />;
      case PostTypeEnum.help_request:
        return <CareIcon color={theme.communityThoughtGrey} />;
    }
  };
  const getText = () => {
    switch (item.subject.postType) {
      case PostTypeEnum.prayer_request:
        return t('postType.prayer').toUpperCase();
      case PostTypeEnum.thought:
        return t('postType.share').toUpperCase();
      case PostTypeEnum.help_request:
        return t('postType.care').toUpperCase();
    }
  };

  const getTitleText = () => {
    switch (item.subject.postType) {
      case PostTypeEnum.prayer_request:
        return t('prayerStepMessage', { personName: person.firstName });
      case PostTypeEnum.thought:
        return t('shareStepMessage', { personName: person.firstName });
      case PostTypeEnum.help_request:
        return t('careStepMessage', { personName: person.firstName });
    }
  };

  const onAddToSteps = () => console.log('added to steps');

  return (
    <Flex value={1}>
      <ScrollView>
        <Header
          right={
            <Button onPress={onClose}>
              <CloseIcon color={theme.white} />
            </Button>
          }
        />
        <Flex style={{ paddingHorizontal: 40, paddingVertical: 10 }}>
          <Flex direction="row">
            {getIcon()}
            <Text style={styles.textStyle}>{getText()}</Text>
          </Flex>
          <Flex>
            <Text style={styles.titleTextStyle}>{getTitleText()}</Text>
          </Flex>
        </Flex>
        <Separator />
        <Flex style={{ paddingHorizontal: 40, paddingVertical: 20 }}>
          <Flex direction="row">
            <Avatar person={person} size={'medium'} />
            <Flex style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                {item.subjectPersonName}
              </Text>
              <CardTime date={item.createdAt} />
            </Flex>
          </Flex>
          <Flex style={{ paddingTop: 10 }}>
            <Text style={{ fontSize: 16, color: theme.grey }}>
              {item.subject.content}
            </Text>
          </Flex>
        </Flex>
      </ScrollView>
      <BottomButton onPress={onAddToSteps} text={t('addToSteps')} />
    </Flex>
  );
};

export default AddPostToStepsScreen;
export const ADD_POST_TO_STEPS_SCREEN = 'nav/ADD_POST_TO_STEPS_SCREEN';
