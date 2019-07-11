import React, { useEffect, useRef } from 'react';
import { ScrollView, View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { communitiesSelector } from '../../selectors/organizations';
import Header from '../../components/Header';
import GroupCardItem from '../../components/GroupCardItem';
import {
  IconButton,
  RefreshControl,
  Button,
  Flex,
} from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import { trackActionWithoutData } from '../../actions/analytics';
import { openMainMenu, keyExtractorId } from '../../utils/common';
import NULL from '../../../assets/images/MemberContacts.png';
import NullStateComponent from '../../components/NullStateComponent';
import { checkForUnreadComments } from '../../actions/unreadComments';
import { getMyCommunities, navigateToOrg } from '../../actions/organizations';
import { resetScrollGroups } from '../../actions/swipe';
import { ACTIONS, GROUPS_TAB } from '../../constants';
import {
  CREATE_COMMUNITY_UNAUTHENTICATED_FLOW,
  JOIN_BY_CODE_FLOW,
} from '../../routes/constants';
import TrackTabChange from '../TrackTabChange';
import { useRefreshing } from '../../utils/hooks/useRefreshing';
import { SwipeState } from '../../reducers/swipe';
import { OrganizationsState } from '../../reducers/organizations';
import { AuthState } from '../../reducers/auth';

import styles from './styles';
import { CREATE_GROUP_SCREEN } from './CreateGroupScreen';

const GroupsListScreen = ({
  dispatch,
  orgs,
  isFirstTime,
  scrollToId,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orgs: any[];
  isFirstTime?: boolean;
  scrollToId?: string | number | null;
}) => {
  const { t } = useTranslation('groupsList');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flatList = useRef<FlatList<any>>(null);

  useEffect(() => {
    async function asyncMount() {
      // Always load groups when this tab mounts
      await loadGroups();
      if (scrollToId) {
        const index = orgs.findIndex(o => o.id === scrollToId);
        if (index >= 0 && flatList.current) {
          flatList.current.scrollToIndex({
            animated: true,
            index,
            // Put the new org in the top of the list if already there or the center
            viewPosition: index === 0 ? 0 : 0.5,
          });
        }
        dispatch(resetScrollGroups());
      }
    }

    asyncMount();
  }, []);

  const loadGroups = () => dispatch(getMyCommunities());
  const { isRefreshing, refresh } = useRefreshing(loadGroups);

  const handleRefresh = () => {
    dispatch(checkForUnreadComments());
    refresh();
  };
  const handlePress = (organization: { id: string }) => {
    dispatch(navigateToOrg(organization.id));
    dispatch(trackActionWithoutData(ACTIONS.SELECT_COMMUNITY));
  };
  const dispatchOpenMainMenu = () => {
    dispatch(openMainMenu());
  };
  const join = () => {
    dispatch(navigatePush(JOIN_BY_CODE_FLOW));
  };
  const create = () => {
    dispatch(
      navigatePush(
        isFirstTime
          ? CREATE_COMMUNITY_UNAUTHENTICATED_FLOW
          : CREATE_GROUP_SCREEN,
      ),
    );
  };

  const renderItem = ({ item }: { item: object }) => (
    <GroupCardItem group={item} onPress={handlePress} />
  );
  const renderNull = () => {
    return (
      <NullStateComponent
        imageSource={NULL}
        headerText={t('header').toUpperCase()}
        descriptionText={t('groupsNull')}
      />
    );
  };
  const renderList = () => {
    return (
      <FlatList
        ref={flatList}
        style={styles.cardList}
        data={orgs}
        keyExtractor={keyExtractorId}
        renderItem={renderItem}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TrackTabChange screen={GROUPS_TAB} />
      <Header
        left={
          <IconButton
            name="menuIcon"
            type="MissionHub"
            onPress={dispatchOpenMainMenu}
          />
        }
        title={t('header').toUpperCase()}
        shadow={false}
      />
      <Flex direction="row">
        <Flex value={1}>
          <Button
            type="transparent"
            style={[styles.blockBtn, styles.blockBtnBorderRight]}
            buttonTextStyle={styles.blockBtnText}
            text={t('joinCommunity').toUpperCase()}
            onPress={join}
          />
        </Flex>
        <Flex value={1}>
          <Button
            type="transparent"
            style={styles.blockBtn}
            buttonTextStyle={styles.blockBtnText}
            text={t('createCommunity').toUpperCase()}
            onPress={create}
          />
        </Flex>
      </Flex>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {orgs.length > 0 ? renderList() : renderNull()}
      </ScrollView>
    </View>
  );
};

const mapStateToProps = ({
  organizations,
  auth,
  swipe,
}: {
  organizations: OrganizationsState;
  auth: AuthState;
  swipe: SwipeState;
}) => ({
  orgs: communitiesSelector({ organizations, auth }),
  isFirstTime: auth.isFirstTime,
  scrollToId: swipe.groupScrollToId,
});

export default connect(mapStateToProps)(GroupsListScreen);
