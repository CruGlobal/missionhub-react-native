import React, { useState } from 'react';
import { TextInput } from 'react-native';
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
import CloseButton, { CloseButtonTypeEnum } from '../../components/CloseButton';
import theme from '../../theme';

import {
  AddPostToMySteps,
  AddPostToMyStepsVariables,
} from './__generated__/AddPostToMySteps';
import { ADD_POST_TO_MY_STEPS } from './queries';
import styles from './styles';

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

  const [stepTitle, changeStepTitle] = useState(getTitleText());

  const onAddToSteps = async () => {
    await addPostToMySteps({
      variables: {
        input: {
          postId: item.subject.id,
          title: stepTitle,
        },
      },
    });
    dispatch(navigateBack());
  };

  const post = {
    ...item.subject,
    author: { ...person },
    createdAt: item.createdAt,
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
