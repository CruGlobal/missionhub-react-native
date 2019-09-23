import React from 'react';
import { SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
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
import { navToPersonScreen } from '../../actions/person';
import TakeAStepWithSomeoneButton from '../TakeAStepWithSomeoneButton';
import TrackTabChange from '../TrackTabChange';
import { PEOPLE_TAB } from '../../constants';
import { ADD_PERSON_THEN_PEOPLE_SCREEN_FLOW } from '../../routes/constants';
import { useRefreshing } from '../../utils/hooks/useRefreshing';
import { AuthState } from '../../reducers/auth';

import styles from './styles';

interface PeopleScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any;
  isJean: boolean;
  hasNoContacts: boolean;
}

export const PeopleScreen = ({
  dispatch,
  items,
  isJean,
  hasNoContacts,
}: PeopleScreenProps) => {
  const { t } = useTranslation('peopleScreen');

  const onOpenMainMenu = () => dispatch(openMainMenu());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddContact = (org: any) => {
    dispatch(
      navigatePush(ADD_PERSON_THEN_PEOPLE_SCREEN_FLOW, {
        organization: org && org.id ? org : undefined,
      }),
    );
  };

  const handleSearch = () => {
    dispatch(navigatePush(SEARCH_SCREEN));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRowSelect = (person: any, org: any) => {
    const organization = org && org.id !== 'personal' ? org : undefined;
    dispatch(navToPersonScreen(person, organization));
  };

  const handleRefresh = () => {
    dispatch(checkForUnreadComments());
    return dispatch(getMyPeople());
  };

  const { isRefreshing, refresh } = useRefreshing(handleRefresh);

  return (
    <SafeAreaView style={styles.pageContainer}>
      <TrackTabChange screen={PEOPLE_TAB} />
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
        onSelect={handleRowSelect}
        onAddContact={handleAddContact}
        onRefresh={refresh}
        refreshing={isRefreshing}
      />
      {hasNoContacts ? <TakeAStepWithSomeoneButton /> : null}
    </SafeAreaView>
  );
};

export const mapStateToProps = ({
  auth,
  people,
}: {
  auth: AuthState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  people: any;
}) => {
  const { isJean } = auth;
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
  };
};

export default connect(mapStateToProps)(PeopleScreen);
