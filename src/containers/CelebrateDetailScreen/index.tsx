import React, { Component } from 'react';
import { Image, View, SafeAreaView, StatusBar } from 'react-native';
import { connect } from 'react-redux-legacy';
import PropTypes from 'prop-types';

import CommentLikeComponent from '../CommentLikeComponent';
import { celebrationItemSelector } from '../../selectors/celebration';
import { organizationSelector } from '../../selectors/organizations';
import CommentsList from '../CommentsList';
import BackButton from '../BackButton';
import CelebrateCommentBox from '../../components/CelebrateCommentBox';
import theme from '../../theme';
import TRAILS1 from '../../../assets/images/Trailss.png';
import TRAILS2 from '../../../assets/images/TrailGrey.png';
import { refresh, keyboardShow } from '../../utils/common';
import { reloadCelebrateComments } from '../../actions/celebrateComments';
import { celebrateCommentsSelector } from '../../selectors/celebrateComments';
import CardTime from '../../components/CardTime';
import CelebrateItemName from '../CelebrateItemName';
import CelebrateItemContent from '../../components/CelebrateItemContent';
import { RefreshControl } from '../../components/common';
import Analytics from '../Analytics';

import styles from './styles';

class CelebrateDetailScreen extends Component {
  state = { refreshing: false };

  componentDidMount() {
    // @ts-ignore
    this.keyboardShowListener = keyboardShow(this.keyboardShow, 'did');
  }

  componentWillUnmount() {
    // @ts-ignore
    this.keyboardShowListener.remove();
  }

  keyboardShow = () => this.scrollToFocusedRef();

  // @ts-ignore
  scrollToEnd = () => this.listRef && this.listRef.scrollToEnd();

  scrollToFocusedRef = () => {
    const {
      // @ts-ignore
      celebrateComments: { comments },
      // @ts-ignore
      editingCommentId,
    } = this.props;
    if (editingCommentId) {
      // @ts-ignore
      const index = comments.findIndex(c => c.id === editingCommentId);
      if (index >= 0) {
        // @ts-ignore
        this.listRef && this.listRef.scrollToIndex({ index, viewPosition: 1 });
        return;
      }
    }
    this.scrollToEnd();
  };

  refreshComments = () => {
    // @ts-ignore
    const { dispatch, event } = this.props;
    return dispatch(reloadCelebrateComments(event));
  };

  handleRefresh = () => refresh(this, this.refreshComments);

  renderHeader = () => {
    // @ts-ignore
    const { event, organization } = this.props;
    return (
      <SafeAreaView>
        <StatusBar {...theme.statusBar.darkContent} />
        <View style={styles.header}>
          // @ts-ignore
          <View flexDirection="row">
            // @ts-ignore
            <View flex={1}>
              <CelebrateItemName
                // @ts-ignore
                name={event.subject_person_name}
                person={event.subject_person}
                organization={organization}
                pressable={true}
              />
              <CardTime date={event.changed_attribute_value} />
            </View>
            // @ts-ignore
            <CommentLikeComponent event={event} />
            <BackButton
              style={styles.backButtonStyle}
              iconStyle={styles.backButtonIconStyle}
              customIcon="deleteIcon"
            />
          </View>
        </View>
      </SafeAreaView>
    );
  };

  renderCommentsList = () => {
    // @ts-ignore
    const { event, organization } = this.props;
    const { refreshing } = this.state;
    return (
      <View style={styles.contentContainer}>
        <Image source={TRAILS1} style={styles.trailsTop} />
        <Image source={TRAILS2} style={styles.trailsBottom} />
        <CommentsList
          event={event}
          // @ts-ignore
          listProps={{
            // @ts-ignore
            ref: c => (this.listRef = c),
            refreshControl: (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.handleRefresh}
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
  };

  renderCommentBox = () => {
    // @ts-ignore
    const { event } = this.props;
    return (
      <CelebrateCommentBox event={event} onAddComplete={this.scrollToEnd} />
    );
  };

  render() {
    return (
      <View style={styles.pageContainer}>
        <Analytics screenName={['celebrate item', 'comments']} />
        {this.renderHeader()}
        {this.renderCommentsList()}
        {this.renderCommentBox()}
      </View>
    );
  }
}

// @ts-ignore
CelebrateDetailScreen.propTypes = {
  event: PropTypes.object.isRequired,
};

const mapStateToProps = (
  // @ts-ignore
  { organizations, celebrateComments },
  {
    navigation: {
      state: {
        // @ts-ignore
        params: { event },
      },
    },
  },
) => ({
  event:
    celebrationItemSelector(
      { organizations },
      { eventId: event.id, organizationId: event.organization.id },
    ) || event,
  organization: organizationSelector(
    { organizations },
    { orgId: event.organization.id },
  ),
  celebrateComments: celebrateCommentsSelector(
    { celebrateComments },
    { eventId: event.id },
  ),
  editingCommentId: celebrateComments.editingCommentId,
});
export default connect(mapStateToProps)(CelebrateDetailScreen);
export const CELEBRATE_DETAIL_SCREEN = 'nav/CELEBRATE_DETAIL_SCREEN';
