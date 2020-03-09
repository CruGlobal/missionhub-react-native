import React from 'react';

import { useTranslation } from 'react-i18next';
import { Button, Flex, Text } from '../../components/common';
import FamilyIcon from '../../../assets/images/categoryFamilyIcon.svg';
import FriendIcon from '../../../assets/images/categoryFriendIcon.svg';
import NeighborIcon from '../../../assets/images/categoryNeighborIcon.svg';
import CoworkerIcon from '../../../assets/images/categoryCoworkerIcon.svg';
import OtherIcon from '../../../assets/images/categoryOtherIcon.svg';
import { RelationshipTypeEnum } from '../../../__generated__/globalTypes';

import styles from './styles';
import theme from '../../theme';

interface PersonCategoryButtonProps {
  currentCategory: RelationshipTypeEnum | null;
  category: RelationshipTypeEnum | null;
  onPress: () => void;
}

const PersonCategoryButton = ({
  currentCategory,
  category,
  onPress,
}: PersonCategoryButtonProps) => {
  const { t } = useTranslation('categories');
  const getImage = () => {
    switch (category) {
      case RelationshipTypeEnum.family:
        return (
          <FamilyIcon
            color={currentCategory === category ? theme.white : '#3CC8E6'}
          />
        );
      case RelationshipTypeEnum.friend:
        return (
          <FriendIcon
            color={currentCategory === category ? theme.white : '#3CC8E6'}
          />
        );
      case RelationshipTypeEnum.neighbor:
        return (
          <NeighborIcon
            color={currentCategory === category ? theme.white : '#3CC8E6'}
          />
        );
      case RelationshipTypeEnum.coworker:
        return (
          <CoworkerIcon
            color={currentCategory === category ? theme.white : '#3CC8E6'}
          />
        );
      case RelationshipTypeEnum.other:
        return (
          <OtherIcon
            color={currentCategory === category ? theme.white : '#3CC8E6'}
          />
        );
    }
  };

  const getContent = () => {
    return (
      <Flex
        style={{ width: '100%', paddingHorizontal: 10 }}
        value={1}
        direction="row"
        justify="between"
        align="center"
      >
        <Text style={styles.categoryButtonText}>{t(`${category}`)}</Text>
        {getImage()}
      </Flex>
    );
  };

  return (
    <Button
      onPress={onPress}
      pill={true}
      style={[
        styles.categoryButton,
        currentCategory === category ? styles.categoryActive : null,
      ]}
      children={getContent()}
    />
  );
};

export default PersonCategoryButton;
