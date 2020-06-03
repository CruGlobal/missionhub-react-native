import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';

import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { navigateBack } from '../../actions/navigation';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import StepDetailScreen from '../../components/StepDetailScreen';
import { PostTypeEnum, StepTypeEnum } from '../../../__generated__/globalTypes';
import { Separator } from '../../components/common';
import CloseButton, { CloseButtonTypeEnum } from '../../components/CloseButton';
import theme from '../../theme';

import {
  AddPostToMySteps,
  AddPostToMyStepsVariables,
} from './__generated__/AddPostToMySteps';
import {
  ADD_POST_TO_MY_STEPS_SCREEN_DETAILS_QUERY,
  ADD_POST_TO_MY_STEPS,
} from './queries';
import {
  AddPostToMyStepsScreenDetails,
  AddPostToMyStepsScreenDetailsVariables,
  AddPostToMyStepsScreenDetails_feedItem_subject_Post,
} from './__generated__/AddPostToMyStepsScreenDetails';
import styles from './styles';

const AddPostToStepsScreen = () => {
  const { t } = useTranslation('addPostToStepsScreen');
  useAnalytics(['add steps', 'step detail']);
  const dispatch = useDispatch();

  const feedItemId: string = useNavigationParam('feedItemId');

  const { data, error, refetch } = useQuery<
    AddPostToMyStepsScreenDetails,
    AddPostToMyStepsScreenDetailsVariables
  >(ADD_POST_TO_MY_STEPS_SCREEN_DETAILS_QUERY, {
    variables: { feedItemId },
    onCompleted: data =>
      data.feedItem.subject.__typename === 'Post' &&
      changeStepTitle(getTitleText(data.feedItem.subject)),
  });

  const subject = data?.feedItem.subject;
  const person = data?.feedItem.subjectPerson;
  if (subject && subject.__typename !== 'Post') {
    throw new Error(
      'Subject type of FeedItem passed to AddPostToStepsScreen must be Post',
    );
  }

  const [addPostToMySteps, { error: createStepError }] = useMutation<
    AddPostToMySteps,
    AddPostToMyStepsVariables
  >(ADD_POST_TO_MY_STEPS);

  const getTitleText = (
    subject?: AddPostToMyStepsScreenDetails_feedItem_subject_Post,
  ) => {
    switch (subject?.postType) {
      case PostTypeEnum.prayer_request:
        return t('prayerStepMessage', { personName: person?.firstName });
      case PostTypeEnum.question:
        return t('shareStepMessage', { personName: person?.firstName });
      case PostTypeEnum.help_request:
        return t('careStepMessage', { personName: person?.firstName });
    }
  };

  const getType = () => {
    switch (subject?.postType) {
      case PostTypeEnum.prayer_request:
        return StepTypeEnum.pray;
      case PostTypeEnum.question:
        return StepTypeEnum.share;
      case PostTypeEnum.help_request:
        return StepTypeEnum.care;
    }
  };

  const [stepTitle, changeStepTitle] = useState(getTitleText(subject));

  const onAddToSteps = async () => {
    if (!subject?.id) {
      return;
    }
    await addPostToMySteps({
      variables: {
        input: {
          postId: subject?.id,
          title: stepTitle,
        },
      },
    });
    dispatch(navigateBack());
  };

  return (
    <StepDetailScreen
      CenterHeader={null}
      RightHeader={
        <CloseButton
          type={CloseButtonTypeEnum.circle}
          iconColor={theme.white}
        />
      }
      hideBackButton={true}
      Banner={
        <>
          <ErrorNotice
            message={t('errorLoadingPostDetails')}
            error={error}
            refetch={refetch}
          />
          <ErrorNotice
            message={t('errorSavingStep')}
            error={createStepError}
            refetch={addPostToMySteps}
          />
        </>
      }
      Input={
        <TextInput
          testID="stepTitleInput"
          onChangeText={changeStepTitle}
          value={stepTitle}
          autoFocus={true}
          autoCorrect={true}
          multiline={true}
          maxLength={255}
          style={styles.inputStyle}
        />
      }
      CenterContent={<Separator />}
      text={getTitleText(subject)}
      stepType={getType()}
      bottomButtonProps={{
        onPress: onAddToSteps,
        text: t('addToSteps'),
        testID: 'AddToMyStepsButton',
      }}
      post={subject}
    />
  );
};

export default AddPostToStepsScreen;
export const ADD_POST_TO_STEPS_SCREEN = 'nav/ADD_POST_TO_STEPS_SCREEN';
