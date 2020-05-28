import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux-legacy';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from 'redux-thunk';

import { getMyPeople } from '../../actions/people';
import { allAssignedPeopleSelector } from '../../selectors/people';
import { navigatePush } from '../../actions/navigation';
import { IconButton } from '../../components/common';
import PeopleList from '../../components/PeopleList';
import Header from '../../components/Header';
import { openMainMenu } from '../../utils/common';
import BottomButton from '../../components/BottomButton';
import { ADD_PERSON_THEN_PEOPLE_SCREEN_FLOW } from '../../routes/constants';
import { useRefreshing } from '../../utils/hooks/useRefreshing';
import { Person } from '../../reducers/people';
import { Organization } from '../../reducers/organizations';
import {
  useAnalytics,
  ANALYTICS_SCREEN_TYPES,
} from '../../utils/hooks/useAnalytics';
import { RootState } from '../../reducers';

import styles from './styles';

interface PeopleScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any;
  isJean: boolean;
  hasNoContacts: boolean;
  person: Person;
}

export const PeopleScreen = ({
  dispatch,
  items,
  hasNoContacts,
  person,
}: PeopleScreenProps) => {
  useAnalytics('people', {
    screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
  });
  const { t } = useTranslation('peopleScreen');

  const onOpenMainMenu = () => dispatch(openMainMenu());

  const handleAddContact = (org: Organization) => {
    dispatch(
      navigatePush(ADD_PERSON_THEN_PEOPLE_SCREEN_FLOW, {
        organization: org && org.id ? org : undefined,
      }),
    );
  };

  const handleRefresh = () => {
    return dispatch(getMyPeople());
  };

  const { isRefreshing, refresh } = useRefreshing(handleRefresh);

  return (
    <View style={styles.pageContainer}>
      <Header
        testID="header"
        left={
          <IconButton
            name="menuIcon"
            type="MissionHub"
            onPress={onOpenMainMenu}
          />
        }
        right={
          <IconButton
            name="addContactIcon"
            type="MissionHub"
            size={24}
            onPress={handleAddContact}
          />
        }
        title={t('header').toUpperCase()}
        shadow={true}
      />
      <PeopleList
        testID="peopleList"
        sections={false}
        items={items}
        onAddContact={handleAddContact}
        onRefresh={refresh}
        refreshing={isRefreshing}
        personId={person.id}
      />
      {hasNoContacts ? (
        <BottomButton
          text={t('mainTabs:takeAStepWithSomeone')}
          onPress={handleAddContact}
        />
      ) : null}
    </View>
  );
};

export const mapStateToProps = ({ auth, people, organizations }: RootState) => {
  const { person } = auth;
  const items = allAssignedPeopleSelector({
    people,
    organizations,
    auth,
  });

  const hasNoContacts = items.length === 1;

  return {
    items,
    hasNoContacts,
    person,
  };
};

export default connect(mapStateToProps)(PeopleScreen);
