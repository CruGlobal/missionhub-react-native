import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux-legacy';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { getMyPeople } from '../../actions/people';
import { allAssignedPeopleSelector } from '../../selectors/people';
import { navigatePush } from '../../actions/navigation';
import { Button } from '../../components/common';
import PeopleList from '../../components/PeopleList';
import Header from '../../components/Header';
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
import AvatarMenuButton from '../../components/AvatarMenuButton';

import styles from './styles';

interface PeopleScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any;
  hasNoContacts: boolean;
  personId: string;
}

export const PeopleScreen = ({
  items,
  hasNoContacts,
  personId,
}: PeopleScreenProps) => {
  useAnalytics('people', {
    screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
  });
  const { t } = useTranslation('peopleScreen');

  const dispatch = useDispatch();

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
      <AnnouncementsModal />
      <Header
        titleStyle={styles.headerTitle}
        testID="header"
        left={<AvatarMenuButton />}
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
    personId: person.id,
  };
};

export default connect(mapStateToProps)(PeopleScreen);
