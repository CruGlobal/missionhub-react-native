import React from 'react';
import { Text } from 'react-native';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Flex, Touchable, Card, DateComponent } from '../common';
import { AuthState } from '../../reducers/auth';
import Avatar from '../Avatar';
import { ChallengeItem } from '../ChallengeStats';

import CompleteCheckIcon from './CompleteCheckIconGreen.svg';
import styles from './styles';

type PersonItem = {
  id: string;
  first_name: string;
  last_name?: string;
};

interface ChallengeMemberItemProps {
  item: ChallengeItem;
  date?: string;
  onSelect?: (person: PersonItem) => void;
}

const ChallengeMemberItem = ({
  date,
  item,
  onSelect,
}: ChallengeMemberItemProps) => {
  const { t } = useTranslation('challengeFeeds');
  const { completed_at, person } = item;
  const auth = useSelector(({ auth }: { auth: AuthState }) => auth);
  const isMe = person.id === auth.person.id;
  const todaysDate = moment().endOf('day');
  const isDateWithinWeek = todaysDate.isSame(moment(date).endOf('day'), 'week');

  const handleSelect = () => {
    onSelect && onSelect(person);
  };

  const content = (
    <Card style={styles.card}>
      <Flex align="center" direction="row" style={styles.row}>
        <Avatar
          style={{ marginRight: 10 }}
          // Use full_name for fullName until we convert these to use graphQL data
          person={{ ...person, fullName: person.full_name }}
          size={'medium'}
        />
        <Flex value={1} justify="between" direction="row" align="center">
          <Flex direction="column">
            <Text style={styles.nameText}>
              {isMe ? t('me') : person.full_name}
            </Text>
            <Text style={[styles.date]}>
              {completed_at ? `${t('completed')} ` : `${t('joined')} `}
              <DateComponent
                style={styles.date}
                date={date ? date : ''}
                format={isDateWithinWeek ? 'dddd' : 'dddd, LL'}
              />
            </Text>
          </Flex>
          <Flex style={{ marginRight: 25 }}>
            {completed_at ? <CompleteCheckIcon /> : null}
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );

  if (onSelect) {
    return (
      <Touchable
        testID="ChallengeMemberItemButton"
        onPress={handleSelect}
        highlight={true}
      >
        {content}
      </Touchable>
    );
  }

  return content;
};

export default ChallengeMemberItem;
