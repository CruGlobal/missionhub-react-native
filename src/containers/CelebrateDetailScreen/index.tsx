import React, { useRef } from 'react';
import { Image, View, SafeAreaView, StatusBar, FlatList } from 'react-native';
import { connect } from 'react-redux-legacy';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';

import CommentLikeComponent from '../CommentLikeComponent';
import { organizationSelector } from '../../selectors/organizations';
import CommentsList from '../CommentsList';
import BackButton from '../BackButton';
import CelebrateCommentBox from '../../components/CelebrateCommentBox';
import theme from '../../theme';
import TRAILS1 from '../../../assets/images/Trailss.png';
import TRAILS2 from '../../../assets/images/TrailGrey.png';
import { reloadCelebrateComments } from '../../actions/celebrateComments';
import { celebrateCommentsSelector } from '../../selectors/celebrateComments';
import CardTime from '../../components/CardTime';
import CelebrateItemName from '../CelebrateItemName';
import CelebrateItemContent from '../../components/CelebrateItemContent';
import { RefreshControl } from '../../components/common';
import Analytics from '../Analytics';
import { GetCelebrateFeed_community_celebrationItems_nodes } from '../CelebrateFeed/__generated__/GetCelebrateFeed';
import { Organization, OrganizationsState } from '../../reducers/organizations';
import {
  CelebrateCommentsState,
  CelebrateComment,
} from '../../reducers/celebrateComments';
import { useKeyboardListeners } from '../../utils/hooks/useKeyboardListeners';
import { useRefreshing } from '../../utils/hooks/useRefreshing';

import styles from './styles';

export interface CelebrateDetailScreenProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  organization: Organization;
  celebrateComments: { comments: CelebrateComment[] };
  editingCommentId: string | null;
}

const CelebrateDetailScreen = ({
  dispatch,
  organization,
  celebrateComments,
  editingCommentId,
}: CelebrateDetailScreenProps) => {
  const event: GetCelebrateFeed_community_celebrationItems_nodes = useNavigationParam(
    'event',
  );
  const onRefreshCelebrateItem: () => void = useNavigationParam(
    'onRefreshCelebrateItem',
  );

  const listRef = useRef<FlatList<CelebrateComment>>(null);

  const scrollToEnd = () => listRef.current && listRef.current.scrollToEnd();

  const scrollToFocusedRef = () => {
    if (editingCommentId) {
      const index = celebrateComments.comments.findIndex(
        c => c.id === editingCommentId,
      );
      if (index >= 0) {
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
      <Analytics screenName={['celebrate item', 'comments']} />
      {renderHeader()}
      {renderCommentsList()}
      {renderCommentBox()}
    </View>
  );
};

const mapStateToProps = (
  {
    organizations,
    celebrateComments,
  }: {
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
) => ({
  organization: organizationSelector({ organizations }, { orgId }),
  celebrateComments: celebrateCommentsSelector(
    { celebrateComments },
    { eventId: event.id },
  ),
  editingCommentId: celebrateComments.editingCommentId,
});
export default connect(mapStateToProps)(CelebrateDetailScreen);
export const CELEBRATE_DETAIL_SCREEN = 'nav/CELEBRATE_DETAIL_SCREEN';
