import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux-legacy';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from 'redux-thunk';

import { getMyPeople } from '../../actions/people';
import { checkForUnreadComments } from '../../actions/unreadComments';
import {
  peopleByOrgSelector,
  allAssignedPeopleSelector,
} from '../../selectors/people';
import { navigatePush } from '../../actions/navigation';
import { IconButton } from '../../components/common';
import PeopleList from '../../components/PeopleList';
import Header from '../../components/Header';
import { openMainMenu } from '../../utils/common';
import { SEARCH_SCREEN } from '../SearchPeopleScreen';
import BottomButton from '../../components/BottomButton';
import { ADD_PERSON_THEN_PEOPLE_SCREEN_FLOW } from '../../routes/constants';
import { useRefreshing } from '../../utils/hooks/useRefreshing';
import { AuthState } from '../../reducers/auth';
import { Person, PeopleState } from '../../reducers/people';
import { Organization } from '../../reducers/organizations';
import { useAnalytics } from '../../utils/hooks/useAnalytics';

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
  isJean,
  hasNoContacts,
  person,
}: PeopleScreenProps) => {
  useAnalytics('people', () => dispatch(checkForUnreadComments()));
  const { t } = useTranslation('peopleScreen');

  const onOpenMainMenu = () => dispatch(openMainMenu());

  const handleAddContact = (org: Organization) => {
    dispatch(
      navigatePush(ADD_PERSON_THEN_PEOPLE_SCREEN_FLOW, {
        organization: org && org.id ? org : undefined,
      }),
    );
  };

  const handleSearch = () => {
    dispatch(navigatePush(SEARCH_SCREEN));
  };

  const handleRefresh = () => {
    dispatch(checkForUnreadComments());
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
          isJean ? (
            <IconButton
              name="searchIcon"
              type="MissionHub"
              onPress={handleSearch}
            />
          ) : (
            <IconButton
              name="addContactIcon"
              type="MissionHub"
              size={24}
              onPress={handleAddContact}
            />
          )
        }
        title={t('header').toUpperCase()}
        shadow={!isJean}
      />
      <PeopleList
        testID="peopleList"
        sections={isJean}
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

export const mapStateToProps = ({
  auth,
  people,
}: {
  auth: AuthState;
  people: PeopleState;
}) => {
  const { isJean, person } = auth;
  const items = isJean
    ? peopleByOrgSelector({ people, auth })
    : allAssignedPeopleSelector({ people, auth });

  const hasNoContacts = isJean
    ? items.length === 1 && items[0].people.length === 1
    : items.length === 1;

  return {
    isJean,
    items,
    hasNoContacts,
    person,
  };
};

export default connect(mapStateToProps)(PeopleScreen);
