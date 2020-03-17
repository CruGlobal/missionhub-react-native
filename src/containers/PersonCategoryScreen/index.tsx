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
import { Person } from '../../reducers/people';
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
  const person: Person = useNavigationParam('person');
  const orgId: string = useNavigationParam('orgId');
  const personCategory = person?.relationship_type
    ? person?.relationship_type
    : null;
  const [category, setCategory] = useState<RelationshipTypeEnum | null>(
    personCategory,
  );

  const [updatePerson] = useMutation<UpdatePerson, UpdatePersonVariables>(
    UPDATE_PERSON,
  );

  const selectCategory = async (relationshipType: RelationshipTypeEnum) => {
    setCategory(relationshipType);
    if (person) {
      const { data } = await updatePerson({
        variables: {
          input: {
            id: person.id,
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
    if (person) {
      return (
        <>
          <Text style={styles.chooseCategoryText}>
            {t('addPersonPrompt.part1')}
          </Text>
          <Text style={styles.chooseCategoryText}>
            {t('addPersonPrompt.part2')}
          </Text>
        </>
      );
    } else {
      return (
        <>
          <Text style={styles.chooseCategoryText}>
            {t('onboardingPrompt.part1')}
          </Text>
          <Text style={styles.chooseCategoryText}>
            {t('onboardingPrompt.part2')}
          </Text>
          <Text style={styles.chooseCategoryText}>
            {t('onboardingPrompt.part3')}
          </Text>
        </>
      );
    }
  };

  const relationshipTypeList = Object.values(RelationshipTypeEnum).slice(1, 4);
  relationshipTypeList[3] = RelationshipTypeEnum.coworker;
  relationshipTypeList[4] = RelationshipTypeEnum.other;

  return (
    <View style={styles.container}>
      <Header left={<BackButton />} />
      <Flex value={2} justify="start" align="center" style={{ marginTop: 20 }}>
        <View style={styles.textWrap}>{getText()}</View>
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
