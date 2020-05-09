import React from 'react';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { ScrollView } from 'react-native';

import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { navigateBack } from '../../actions/navigation';
import Header from '../../components/Header';
import {
  Button,
  Flex,
  Text,
  Separator,
  DateComponent,
} from '../../components/common';
import BottomButton from '../../components/BottomButton';
import CloseIcon from '../../../assets/images/closeButton.svg';
import PrayerIcon from '../../../assets/images/prayerRequestIcon.svg';
import ShareIcon from './shareStepIcon.svg';
import CareIcon from '../../../assets/images/careRequestIcon.svg';
import Avatar from '../../components/Avatar';
import { PostTypeEnum } from '../../../__generated__/globalTypes';
import {
  AddPostToMySteps,
  AddPostToMyStepsVariables,
} from './__generated__/AddPostToMySteps';
import { ADD_POST_TO_MY_STEPS } from './queries';
import styles from './styles';

import theme from '../../theme';

const AddPostToStepsScreen = () => {
  const { t } = useTranslation('addPostToStepsScreen');
  useAnalytics(['add steps', 'step detail']);
  const dispatch = useDispatch();

  const item = useNavigationParam('item');
  const person = item.subjectPerson;

  const [addPostToMySteps] = useMutation<
    AddPostToMySteps,
    AddPostToMyStepsVariables
  >(ADD_POST_TO_MY_STEPS);

  const onClose = () => {
    dispatch(navigateBack());
  };

  const getIcon = () => {
    switch (item.subject.postType) {
      case PostTypeEnum.prayer_request:
        return <PrayerIcon color={theme.communityThoughtGrey} />;
      case PostTypeEnum.question:
        return <ShareIcon color={theme.communityThoughtGrey} />;
      case PostTypeEnum.help_request:
        return <CareIcon color={theme.communityThoughtGrey} />;
    }
  };
  const getText = () => {
    switch (item.subject.postType) {
      case PostTypeEnum.prayer_request:
        return t('postType.prayer').toUpperCase();
      case PostTypeEnum.question:
        return t('postType.share').toUpperCase();
      case PostTypeEnum.help_request:
        return t('postType.care').toUpperCase();
    }
  };

  const getTitleText = () => {
    switch (item.subject.postType) {
      case PostTypeEnum.prayer_request:
        return t('prayerStepMessage', { personName: person.firstName });
      case PostTypeEnum.question:
        return t('shareStepMessage', { personName: person.firstName });
      case PostTypeEnum.help_request:
        return t('careStepMessage', { personName: person.firstName });
    }
  };

  const onAddToSteps = async () => {
    await addPostToMySteps({
      variables: {
        input: {
          postId: item.subject.id,
          title: getTitleText(),
        },
      },
    });
    dispatch(navigateBack());
  };

  // const onCompleteStep = () => {
  // Add ability to complete step if step exist
  // };

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
              <Text style={styles.personNameStyle}>
                {item.subjectPersonName}
              </Text>
              <DateComponent
                style={styles.dateTextStyle}
                date={item.createdAt}
                format={'MMM D @ LT'}
              />
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
