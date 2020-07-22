import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux-legacy';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';

import { getMyPeople } from '../../actions/people';
import { allAssignedPeopleSelector } from '../../selectors/people';
import { navigatePush } from '../../actions/navigation';
import { Button } from '../../components/common';
import PeopleList from '../../components/PeopleList';
import Header from '../../components/Header';
import { openMainMenu } from '../../utils/common';
import BottomButton from '../../components/BottomButton';
import { ADD_PERSON_THEN_PEOPLE_SCREEN_FLOW } from '../../routes/constants';
import { useRefreshing } from '../../utils/hooks/useRefreshing';
import { Organization } from '../../reducers/organizations';
import {
  useAnalytics,
  ANALYTICS_SCREEN_TYPES,
} from '../../utils/hooks/useAnalytics';
import { RootState } from '../../reducers';
import AddPersonIcon from '../../../assets/images/addPersonIcon.svg';
import AnnouncementsModal from '../../components/AnnouncementsModal';
import Avatar from '../../components/Avatar';
import { GET_MY_AVATAR_AND_EMAIL } from '../../components/SideMenu/queries';
import { GetMyAvatarAndEmail } from '../../components/SideMenu/__generated__/GetMyAvatarAndEmail';

import styles from './styles';

interface PeopleScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any;
  hasNoContacts: boolean;
}

export const PeopleScreen = ({ items, hasNoContacts }: PeopleScreenProps) => {
  useAnalytics('people', {
    screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
  });
  const { t } = useTranslation('peopleScreen');

  const dispatch = useDispatch();

  const { data: { currentUser } = {} } = useQuery<GetMyAvatarAndEmail>(
    GET_MY_AVATAR_AND_EMAIL,
    { fetchPolicy: 'cache-first' },
  );

  const onOpenMainMenu = () => dispatch(openMainMenu());

  const handleAddContact = (org: Organization) => {
    dispatch(
      navigatePush(ADD_PERSON_THEN_PEOPLE_SCREEN_FLOW, {
        organization: org && org.id ? org : undefined,
      }),
    );
  };
  const person = currentUser?.person;
  const personId = person?.id || '';

  const handleRefresh = () => {
    return dispatch(getMyPeople());
  };

  const { isRefreshing, refresh } = useRefreshing(handleRefresh);

  return (
    <View style={styles.pageContainer}>
      <AnnouncementsModal />
      <Header
        titleStyle={styles.headerTitle}
        testID="header"
        left={
          <Button onPress={onOpenMainMenu}>
            <Avatar size={'medium'} person={currentUser?.person} />
          </Button>
        }
        right={
          <Button onPress={handleAddContact}>
            <AddPersonIcon />
          </Button>
        }
        title={t('header')}
        shadow={true}
      />
      <PeopleList
        testID="peopleList"
        sections={false}
        items={items}
        onRefresh={refresh}
        refreshing={isRefreshing}
        personId={personId}
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

const mapStateToProps = ({ auth, people, organizations }: RootState) => {
  const items = allAssignedPeopleSelector({
    people,
    organizations,
    auth,
  });

  const hasNoContacts = items.length === 1;

  return {
    items,
    hasNoContacts,
  };
};

export default connect(mapStateToProps)(PeopleScreen);
