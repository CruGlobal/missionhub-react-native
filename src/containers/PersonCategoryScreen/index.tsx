import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/react-hooks';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { Text, Flex } from '../../components/common';
import PersonCategoryButton from '../../components/PersonCategoryButton';
import Header from '../../components/Header';
import BackButton from '../BackButton';
import { RelationshipTypeEnum } from '../../../__generated__/globalTypes';
import { UPDATE_PERSON } from '../../containers/SetupScreen/queries';
import {
  UpdatePerson,
  UpdatePersonVariables,
} from '../../containers/SetupScreen/__generated__/UpdatePerson';

import styles from './styles';

interface PersonCategoryScreenProps {
  next: (props: {
    personId?: string;
    orgId?: string;
    relationshipType?: RelationshipTypeEnum;
  }) => ThunkAction<unknown, {}, {}, AnyAction>;
}
RelationshipTypeEnum;

const PersonCategoryScreen = ({ next }: PersonCategoryScreenProps) => {
  const { t } = useTranslation('categories');
  useAnalytics(['add person', 'select category']);
  const dispatch = useDispatch();
  const personId: string = useNavigationParam('personId');
  const relationshipType: RelationshipTypeEnum = useNavigationParam(
    'relationshipType',
  );
  const orgId: string = useNavigationParam('orgId');
  const [category, setCategory] = useState<RelationshipTypeEnum | null>(
    relationshipType || null,
  );

  const [updatePerson] = useMutation<UpdatePerson, UpdatePersonVariables>(
    UPDATE_PERSON,
  );

  const selectCategory = async (relationshipType: RelationshipTypeEnum) => {
    setCategory(relationshipType);
    if (personId) {
      const { data } = await updatePerson({
        variables: {
          input: {
            id: personId,
            relationshipType,
          },
        },
      });
      data?.updatePerson?.person &&
        dispatch(next({ personId: data?.updatePerson?.person.id, orgId }));
    } else {
      dispatch(next({ relationshipType }));
    }
  };

  const getText = () => {
    if (personId) {
      return (
        <Text style={styles.chooseCategoryText}>{t('addPersonPrompt')}</Text>
      );
    } else {
      return (
        <Text
          style={[
            styles.chooseCategoryText,
            styles.chooseCategoryTextOnboarding,
          ]}
        >
          {t('onboardingPrompt')}
        </Text>
      );
    }
  };

  const relationshipTypeList = [
    RelationshipTypeEnum.family,
    RelationshipTypeEnum.friend,
    RelationshipTypeEnum.neighbor,
    RelationshipTypeEnum.coworker,
    RelationshipTypeEnum.other,
  ];

  return (
    <View style={styles.container}>
      <Header left={<BackButton />} />
      <Flex value={2} justify="start" align="center" style={{ marginTop: 20 }}>
        <View style={styles.textWrap}>{getText()}</View>
        {Object.values(relationshipTypeList).map(type => (
          <PersonCategoryButton
            key={type}
            isSelected={category === type}
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
