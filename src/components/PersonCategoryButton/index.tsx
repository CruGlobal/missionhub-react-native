import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Flex, Text } from '../../components/common';
import FamilyIcon from '../../../assets/images/categoryFamilyIcon.svg';
import FriendIcon from '../../../assets/images/categoryFriendIcon.svg';
import NeighborIcon from '../../../assets/images/categoryNeighborIcon.svg';
import CoworkerIcon from '../../../assets/images/categoryCoworkerIcon.svg';
import OtherIcon from '../../../assets/images/categoryOtherIcon.svg';
import { RelationshipTypeEnum } from '../../../__generated__/globalTypes';
import theme from '../../theme';

import styles from './styles';

interface PersonCategoryButtonProps {
  isSelected: boolean;
  category: RelationshipTypeEnum | null;
  onPress: () => void;
}

const PersonCategoryButton = ({
  isSelected,
  category,
  onPress,
}: PersonCategoryButtonProps) => {
  const { t } = useTranslation('categories');
  const getImage = () => {
    switch (category) {
      case RelationshipTypeEnum.family:
        return (
          <FamilyIcon color={isSelected ? theme.white : theme.challengeBlue} />
        );
      case RelationshipTypeEnum.friend:
        return (
          <FriendIcon color={isSelected ? theme.white : theme.challengeBlue} />
        );
      case RelationshipTypeEnum.neighbor:
        return (
          <NeighborIcon
            color={isSelected ? theme.white : theme.challengeBlue}
          />
        );
      case RelationshipTypeEnum.coworker:
        return (
          <CoworkerIcon
            color={isSelected ? theme.white : theme.challengeBlue}
          />
        );
      case RelationshipTypeEnum.other:
        return (
          <OtherIcon color={isSelected ? theme.white : theme.challengeBlue} />
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
      testID={`${category}Button`}
      onPress={onPress}
      pill={true}
      style={[styles.categoryButton, isSelected ? styles.categoryActive : null]}
      // eslint-disable-next-line
      children={getContent()}
    />
  );
};

export default PersonCategoryButton;
