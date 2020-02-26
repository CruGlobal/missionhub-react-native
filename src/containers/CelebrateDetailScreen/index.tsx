import React, { useRef } from 'react';
import { Image, View, SafeAreaView, StatusBar, FlatList } from 'react-native';
import { connect } from 'react-redux-legacy';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';
import { useApolloClient } from '@apollo/react-hooks';

import CommentLikeComponent from '../CommentLikeComponent';
import { organizationSelector } from '../../selectors/organizations';
import CommentsList from '../CommentsList';
import BackButton from '../BackButton';
import CelebrateCommentBox from '../../components/CelebrateCommentBox';
import theme from '../../theme';
import TRAILS1 from '../../../assets/images/Trailss.png';
import TRAILS2 from '../../../assets/images/TrailGrey.png';
import { reloadCelebrateComments } from '../../actions/celebrateComments';
import { TrackStateContext } from '../../actions/analytics';
import { celebrateCommentsSelector } from '../../selectors/celebrateComments';
import CardTime from '../../components/CardTime';
import CelebrateItemName from '../CelebrateItemName';
import CelebrateItemContent from '../../components/CelebrateItemContent';
import { RefreshControl } from '../../components/common';
import {
  ANALYTICS_ASSIGNMENT_TYPE,
  ANALYTICS_PERMISSION_TYPE,
} from '../../constants';
import Analytics from '../Analytics';
import { GetCelebrateFeed_community_celebrationItems_nodes as CelebrateItem } from '../CelebrateFeed/__generated__/GetCelebrateFeed';
import { CELEBRATE_ITEM_FRAGMENT } from '../../components/CelebrateItem/queries';
import { Organization, OrganizationsState } from '../../reducers/organizations';
import {
  CelebrateCommentsState,
  CelebrateComment,
} from '../../reducers/celebrateComments';
import { AuthState } from '../../reducers/auth';
import {
  getAnalyticsAssignmentType,
  getAnalyticsPermissionType,
} from '../../utils/common';
import { orgPermissionSelector } from '../../selectors/people';
import { useKeyboardListeners } from '../../utils/hooks/useKeyboardListeners';
import { useRefreshing } from '../../utils/hooks/useRefreshing';

import styles from './styles';

export interface CelebrateDetailScreenProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  organization: Organization;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  celebrateComments?: { comments: CelebrateComment[]; pagination: any };
  editingCommentId: string | null;
  analyticsAssignmentType: TrackStateContext[typeof ANALYTICS_ASSIGNMENT_TYPE];
  analyticsPermissionType: TrackStateContext[typeof ANALYTICS_PERMISSION_TYPE];
}

const CelebrateDetailScreen = ({
  dispatch,
  organization,
  celebrateComments,
  editingCommentId,
  analyticsAssignmentType,
  analyticsPermissionType,
}: CelebrateDetailScreenProps) => {
  const client = useApolloClient();
  const navParamsEvent: CelebrateItem = useNavigationParam('event');
  const event =
    client.readFragment<CelebrateItem>({
      id: `CommunityCelebrationItem:${navParamsEvent.id}`,
      fragment: CELEBRATE_ITEM_FRAGMENT,
      fragmentName: 'CelebrateItem',
    }) || navParamsEvent;
  const onRefreshCelebrateItem: () => void = useNavigationParam(
    'onRefreshCelebrateItem',
  );

  const listRef = useRef<FlatList<CelebrateComment>>(null);

  const scrollToEnd = () => listRef.current && listRef.current.scrollToEnd();

  const scrollToFocusedRef = () => {
    if (editingCommentId) {
      const index =
        celebrateComments &&
        celebrateComments.comments.findIndex(c => c.id === editingCommentId);
      if (index && index >= 0) {
        listRef.current &&
          listRef.current.scrollToIndex({ index, viewPosition: 1 });
        return;
      }
    }
    scrollToEnd();
  };

  useKeyboardListeners({ onShow: () => scrollToFocusedRef() });

  const refreshComments = () => {
    return dispatch(reloadCelebrateComments(event.id, organization.id));
  };

  const { isRefreshing, refresh } = useRefreshing(refreshComments);

  const renderHeader = () => (
    <SafeAreaView>
      <StatusBar {...theme.statusBar.darkContent} />
      <View style={styles.header}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <CelebrateItemName
              name={event.subjectPersonName}
              person={event.subjectPerson}
              organization={organization}
              pressable={true}
            />
            <CardTime date={event.changedAttributeValue} />
          </View>
          <CommentLikeComponent
            event={event}
            organization={organization}
            onRefresh={onRefreshCelebrateItem}
          />
          <BackButton
            style={styles.backButtonStyle}
            iconStyle={styles.backButtonIconStyle}
            customIcon="deleteIcon"
          />
        </View>
      </View>
    </SafeAreaView>
  );

  const renderCommentsList = () => (
    <View style={styles.contentContainer}>
      <Image source={TRAILS1} style={styles.trailsTop} />
      <Image source={TRAILS2} style={styles.trailsBottom} />
      <CommentsList
        event={event}
        organization={organization}
        listProps={{
          ref: listRef,
          refreshControl: (
            <RefreshControl
              testID="RefreshControl"
              refreshing={isRefreshing}
              onRefresh={refresh}
            />
          ),
          ListHeaderComponent: () => (
            <CelebrateItemContent
              event={event}
              organization={organization}
              style={styles.itemContent}
            />
          ),
        }}
      />
    </View>
  );

  const renderCommentBox = () => (
    <CelebrateCommentBox
      event={event}
      onAddComplete={scrollToEnd}
      organization={organization}
    />
  );

  return (
    <View style={styles.pageContainer}>
      <Analytics
        screenName={['celebrate item', 'comments']}
        screenContext={{
          [ANALYTICS_ASSIGNMENT_TYPE]: analyticsAssignmentType,
          [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType,
        }}
      />
      {renderHeader()}
      {renderCommentsList()}
      {renderCommentBox()}
    </View>
  );
};

const mapStateToProps = (
  {
    auth,
    organizations,
    celebrateComments,
  }: {
    auth: AuthState;
    organizations: OrganizationsState;
    celebrateComments: CelebrateCommentsState;
  },
  {
    navigation: {
      state: {
        params: { event, orgId },
      },
    },
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
) => {
  const { subjectPerson } = event as CelebrateItem;
  const organization = organizationSelector({ organizations }, { orgId });
  const orgPermission = orgPermissionSelector(
    {},
    { person: subjectPerson, organization },
  );

  return {
    organization,
    celebrateComments: celebrateCommentsSelector(
      { celebrateComments },
      { eventId: event.id },
    ),
    editingCommentId: celebrateComments.editingCommentId,
    analyticsAssignmentType:
      (subjectPerson &&
        getAnalyticsAssignmentType(subjectPerson.id, auth, orgPermission)) ||
      ('' as TrackStateContext[typeof ANALYTICS_ASSIGNMENT_TYPE]),
    analyticsPermissionType:
      (subjectPerson && getAnalyticsPermissionType(orgPermission)) ||
      ('' as TrackStateContext[typeof ANALYTICS_PERMISSION_TYPE]),
  };
};
export default connect(mapStateToProps)(CelebrateDetailScreen);
export const CELEBRATE_DETAIL_SCREEN = 'nav/CELEBRATE_DETAIL_SCREEN';
