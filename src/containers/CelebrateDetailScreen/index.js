import React, { Component } from 'react';
import { Image, View, SafeAreaView, StatusBar } from 'react-native';
import { connect } from 'react-redux';
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
import TrackOnFocus from '../TrackOnFocus';

import styles from './styles';

class CelebrateDetailScreen extends Component {
  state = { refreshing: false };

  componentDidMount() {
    this.keyboardShowListener = keyboardShow(this.keyboardShow, 'did');
  }

  componentWillUnmount() {
    this.keyboardShowListener.remove();
  }

  keyboardShow = () => this.scrollToFocusedRef();

  scrollToEnd = () => this.listRef && this.listRef.scrollToEnd();

  scrollToFocusedRef = () => {
    const {
      celebrateComments: { comments },
      editingCommentId,
    } = this.props;
    if (editingCommentId) {
      const index = comments.findIndex(c => c.id === editingCommentId);
      if (index >= 0) {
        this.listRef && this.listRef.scrollToIndex({ index, viewPosition: 1 });
        return;
      }
    }
    this.scrollToEnd();
  };

  refreshComments = () => {
    const { dispatch, event } = this.props;
    return dispatch(reloadCelebrateComments(event));
  };

  handleRefresh = () => refresh(this, this.refreshComments);

  renderHeader = () => {
    const { event, organization } = this.props;
    return (
      <SafeAreaView>
        <StatusBar {...theme.statusBar.darkContent} />
        <TrackOnFocus screenNameFragments={['celebrate item', 'comments']} />
        <View style={styles.header}>
          <View flexDirection="row">
            <View flex={1}>
              <CelebrateItemName
                name={event.subject_person_name}
                person={event.subject_person}
                organization={organization}
                pressable={true}
              />
              <CardTime date={event.changed_attribute_value} />
            </View>
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
    const { event, organization } = this.props;
    const { refreshing } = this.state;
    return (
      <View style={styles.contentContainer}>
        <Image source={TRAILS1} style={styles.trailsTop} />
        <Image source={TRAILS2} style={styles.trailsBottom} />
        <CommentsList
          event={event}
          listProps={{
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
                fixedHeight={false}
                style={styles.itemContent}
              />
            ),
          }}
        />
      </View>
    );
  };

  renderCommentBox = () => {
    const { event } = this.props;
    return (
      <CelebrateCommentBox event={event} onAddComplete={this.scrollToEnd} />
    );
  };

  render() {
    return (
      <View style={styles.pageContainer}>
        {this.renderHeader()}
        {this.renderCommentsList()}
        {this.renderCommentBox()}
      </View>
    );
  }
}

CelebrateDetailScreen.propTypes = {
  event: PropTypes.object.isRequired,
};

const mapStateToProps = (
  { organizations, celebrateComments },
  {
    navigation: {
      state: {
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
