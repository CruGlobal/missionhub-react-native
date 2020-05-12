import React from 'react';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';

import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { navigateBack } from '../../actions/navigation';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import StepDetailScreen from '../../components/StepDetailScreen';
import { PostTypeEnum, StepTypeEnum } from '../../../__generated__/globalTypes';
import { Separator } from '../../components/common';
import CloseIcon from '../../../assets/images/closeButton.svg';
import BackButton from '../BackButton';
import theme from '../../theme';

import {
  AddPostToMySteps,
  AddPostToMyStepsVariables,
} from './__generated__/AddPostToMySteps';
import { ADD_POST_TO_MY_STEPS } from './queries';

const AddPostToStepsScreen = () => {
  const { t } = useTranslation('addPostToStepsScreen');
  useAnalytics(['add steps', 'step detail']);
  const dispatch = useDispatch();

  const item = useNavigationParam('item');
  const person = item.subjectPerson;

  const [addPostToMySteps, { error: createStepError }] = useMutation<
    AddPostToMySteps,
    AddPostToMyStepsVariables
  >(ADD_POST_TO_MY_STEPS);

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

  const getType = () => {
    switch (item.subject.postType) {
      case PostTypeEnum.prayer_request:
        return StepTypeEnum.pray;
      case PostTypeEnum.question:
        return StepTypeEnum.share;
      case PostTypeEnum.help_request:
        return StepTypeEnum.care;
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
  const post = { ...item.subject, author: { ...person } };
  return (
    <StepDetailScreen
      CenterHeader={null}
      RightHeader={
        <BackButton RenderIcon={<CloseIcon color={theme.white} />} />
      }
      noLeftHeader={true}
      Banner={
        <>
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
      post={post}
    />
  );
};

export default AddPostToStepsScreen;
export const ADD_POST_TO_STEPS_SCREEN = 'nav/ADD_POST_TO_STEPS_SCREEN';
