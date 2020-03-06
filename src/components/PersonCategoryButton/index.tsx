import React from 'react';

import { useTranslation } from 'react-i18next';
import { Button, Flex, Text } from '../../components/common';
import styles from './styles';
import { RelationshipTypeEnum } from '../../../__generated__/globalTypes';

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
  // const getImage = () => {
  //   switch (category) {
  //     case RelationshipTypeEnum.family:
  //       return FAMILY;
  //     case RelationshipTypeEnum.friend:
  //       return FRIEND;
  //     case RelationshipTypeEnum.neighbor:
  //       return NEIGHBOR;
  //     case RelationshipTypeEnum.coworker:
  //       return COWORKER;
  //     case RelationshipTypeEnum.other:
  //       return OTHER;
  //   }
  // };

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
        {/* <Image source={getImage()} /> */}
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
