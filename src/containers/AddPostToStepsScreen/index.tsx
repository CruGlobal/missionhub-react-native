import React from 'react';
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
} from './__generated__/AddPostToMyStepsScreenDetails';

const AddPostToStepsScreen = () => {
  const { t } = useTranslation('addPostToStepsScreen');
  useAnalytics(['add steps', 'step detail']);
  const dispatch = useDispatch();

  const feedItemId: string = useNavigationParam('feedItemId');

  const { data, error, refetch } = useQuery<
    AddPostToMyStepsScreenDetails,
    AddPostToMyStepsScreenDetailsVariables
  >(ADD_POST_TO_MY_STEPS_SCREEN_DETAILS_QUERY, { variables: { feedItemId } });

  const subject = data?.feedItem.subject;
  const person = data?.feedItem.subjectPerson;
  if (subject && subject.__typename !== 'Post') {
    throw new Error(
      'Subject type of FeedItem passed to AddPostToStepsScreen must me Post',
    );
  }

  const [addPostToMySteps, { error: createStepError }] = useMutation<
    AddPostToMySteps,
    AddPostToMyStepsVariables
  >(ADD_POST_TO_MY_STEPS);

  const getTitleText = () => {
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

  const onAddToSteps = async () => {
    if (!subject?.id) {
      return;
    }
    await addPostToMySteps({
      variables: {
        input: {
          postId: subject?.id,
          title: getTitleText(),
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
      CenterContent={<Separator />}
      text={getTitleText()}
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
