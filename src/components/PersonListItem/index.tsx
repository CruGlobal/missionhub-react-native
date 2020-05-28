import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, TextStyle } from 'react-native';
import { useSelector } from 'react-redux';

import { Flex, Text, Touchable } from '../common';
import { RootState } from '../../reducers';
import { contactAssignmentSelector } from '../../selectors/people';

import styles from './styles';

type PersonItem = {
  id: string;
  first_name: string;
  last_name?: string;
  reverse_contact_assignments?: { organization?: { id: string } }[];
};

interface PersonListItemProps {
  person: PersonItem;
  organization: { id: string };
  onSelect?: (person: PersonItem) => void;
  hideUnassigned?: boolean;
  nameTextStyle?: StyleProp<TextStyle>;
  lastNameAccentStyle?: StyleProp<TextStyle>;
}

const PersonListItem = ({
  person,
  onSelect,
  organization,
  hideUnassigned,
  nameTextStyle = {},
  lastNameAccentStyle = {},
}: PersonListItemProps) => {
  const { t } = useTranslation('groupItem');
  const handleSelect = () => {
    onSelect && onSelect(person);
  };
  const isAssigned = useSelector(({ auth }: RootState) =>
    contactAssignmentSelector({ auth }, { person, orgId: organization.id }),
  );
  const content = (
    <Flex align="center" direction="row" style={styles.row}>
      <Flex value={1} justify="start" direction="row">
        <Text style={[styles.name, nameTextStyle]}>{person.first_name}</Text>
        {person.last_name ? (
          <Text style={[styles.name, nameTextStyle, lastNameAccentStyle]}>
            {` ${person.last_name}`}
          </Text>
        ) : null}
      </Flex>
      {isAssigned || hideUnassigned ? null : (
        <Text style={styles.unassigned}>{t('unassigned')}</Text>
      )}
    </Flex>
  );

  if (onSelect) {
    return (
      <Touchable
        testID="PersonListItemButton"
        onPress={handleSelect}
        highlight={true}
      >
        {content}
      </Touchable>
    );
  }

  return content;
};

export default PersonListItem;
