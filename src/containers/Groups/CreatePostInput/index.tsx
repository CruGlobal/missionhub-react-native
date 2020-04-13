import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Button, Text } from '../../../components/common';

import { Organization } from '../../../reducers/organizations';
import { GLOBAL_COMMUNITY_ID } from '../../../constants';
import Avatar from '../../../components/Avatar';
import { AuthState } from '../../../reducers/auth';
import { PostTypeEnum } from '../../../components/PostTypeLabel';
import CreatePostModal from '../CreatePostModal';

import styles from './styles';

interface CreatePostInputProps {
  type?: PostTypeEnum;
  organization: Organization;
}

const CreatePostInput = ({ type, organization }: CreatePostInputProps) => {
  const { t } = useTranslation('createPostScreen');
  const { container, inputButton, inputText } = styles;
  const { id } = organization;
  const personId = useSelector(
    ({ auth }: { auth: AuthState }) => auth.person.id,
  );
  const [isModalOpen, changeModalVisibility] = useState(false);

  const openModal = () => {
    changeModalVisibility(true);
  };
  const closeModal = () => {
    changeModalVisibility(false);
  };

  return id !== GLOBAL_COMMUNITY_ID ? (
    <View style={container}>
      {isModalOpen ? <CreatePostModal closeModal={closeModal} /> : null}

      <Button style={inputButton} onPress={openModal} testID="CreatePostInput">
        <Avatar size="small" personId={personId} style={{ marginLeft: -15 }} />
        <Text style={inputText}>
          {type ? t(`${type}`) : t('inputPlaceholder')}
        </Text>
      </Button>
    </View>
  ) : null;
};

export default CreatePostInput;
