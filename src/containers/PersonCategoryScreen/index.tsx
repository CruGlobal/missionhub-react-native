import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { View } from 'react-native';
import { Text, Flex } from '../../components/common';
import PersonCategoryButton from '../../components/PersonCategoryButton';
import Header from '../../components/Header';
import BackButton from '../BackButton';
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';
import { RelationshipTypeEnum } from '../../../__generated__/globalTypes';

import styles from './styles';

interface PersonCategoryScreenProps {
  next: (props: {
    relationshipType?: RelationshipTypeEnum;
  }) => ThunkAction<unknown, {}, {}, AnyAction>;
}
RelationshipTypeEnum;

const PersonCategoryScreen = ({ next }: PersonCategoryScreenProps) => {
  const { t } = useTranslation('categories');
  const dispatch = useDispatch();
  const [category, setCategory] = useState<RelationshipTypeEnum | null>(null);

  const selectCategory = (relationshipType: RelationshipTypeEnum) => {
    setCategory(relationshipType);
    dispatch(next({ relationshipType }));
  };

  const relationshipTypeList = Object.values(RelationshipTypeEnum).slice(1, 4);
  relationshipTypeList[3] = RelationshipTypeEnum.coworker;
  relationshipTypeList[4] = RelationshipTypeEnum.other;

  return (
    <View style={styles.container}>
      <Header left={<BackButton />} />
      <Flex value={2} justify="start" align="center" style={{ marginTop: 20 }}>
        <View style={styles.textWrap}>
          <Text style={styles.chooseCategoryText}>
            {t('onboardingPrompt.part1')}
          </Text>
          <Text style={styles.chooseCategoryText}>
            {t('onboardingPrompt.part2')}
          </Text>
          <Text style={styles.chooseCategoryText}>
            {t('onboardingPrompt.part3')}
          </Text>
        </View>
        {Object.values(relationshipTypeList).map(type => (
          <PersonCategoryButton
            key={type}
            currentCategory={category}
            category={type}
            onPress={() => selectCategory(type)}
          />
        ))}
      </Flex>
    </View>
  );
};

export default PersonCategoryScreen;
export const PERSON_CATEGORY_SCREEN = 'nav/PERSON_CATEGORY_SCREEN';
