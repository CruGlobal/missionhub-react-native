import React, { Component } from 'react';
import { Image, View, SafeAreaView, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/default
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import CommentLikeComponent from '../CommentLikeComponent';
import { celebrationItemSelector } from '../../selectors/celebration';
import CelebrateItem from '../../components/CelebrateItem';
import CommentsList from '../CommentsList';
import BackButton from '../BackButton';
import CelebrateCommentBox from '../../components/CelebrateCommentBox';
import theme from '../../theme';
import Header from '../../components/Header';
import ItemHeaderText from '../../components/ItemHeaderText';
import TRAILS1 from '../../../assets/images/Trailss.png';
import TRAILS2 from '../../../assets/images/TrailGrey.png';
import { refresh } from '../../utils/common';
import { reloadCelebrateComments } from '../../actions/celebrateComments';
import { RefreshControl } from '../../components/common';

import styles from './styles';

class CelebrateDetailScreen extends Component {
  state = { refreshing: false };

  refreshComments = () => {
    const { dispatch, event } = this.props;

    return dispatch(reloadCelebrateComments(event));
  };

  handleRefresh = () => refresh(this, this.refreshComments);

  renderBackButton = () => {
    const { backButtonStyle } = styles;

    return <BackButton iconStyle={backButtonStyle} customIcon="deleteIcon" />;
  };

  renderForeground = () => {
    const { event } = this.props;
    const { cardStyle } = styles;

    return (
      <CelebrateItem
        event={event}
        cardStyle={cardStyle}
        rightCorner={this.renderBackButton()}
        namePressable={true}
      />
    );
  };

  renderStickyHeader = () => {
    const { event } = this.props;
    const { subject_person_name } = event;
    const { headerStyle, leftHeaderItemStyle, rightHeaderItemStyle } = styles;

    return (
      <Header
        shadow={false}
        left={
          <ItemHeaderText
            text={subject_person_name}
            style={leftHeaderItemStyle}
          />
        }
        right={
          <View style={rightHeaderItemStyle}>
            <CommentLikeComponent event={event} />
            {this.renderBackButton()}
          </View>
        }
        style={headerStyle}
      />
    );
  };

  render() {
    const { event } = this.props;
    const { container } = styles;
    const {
      white,
      grey,
      parallaxHeaderHeight,
      headerHeight,
      statusBar: { darkContent },
    } = theme;

    return (
      <SafeAreaView style={container}>
        <StatusBar {...darkContent} />
        <ParallaxScrollView
          backgroundColor={white}
          contentBackgroundColor={grey}
          parallaxHeaderHeight={parallaxHeaderHeight}
          renderForeground={this.renderForeground}
          stickyHeaderHeight={headerHeight}
          renderStickyHeader={this.renderStickyHeader}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
          }
        >
          <View style={styles.scrollContent}>
            <Image source={TRAILS1} style={styles.trailsTop} />
            <Image source={TRAILS2} style={styles.trailsBottom} />
            <CommentsList
              event={event}
              organizationId={event.organization.id}
            />
          </View>
        </ParallaxScrollView>
        <CelebrateCommentBox event={event} />
      </SafeAreaView>
    );
  }
}

CelebrateDetailScreen.propTypes = {
  event: PropTypes.object.isRequired,
};

const mapStateToProps = (
  { organizations },
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
});
export default connect(mapStateToProps)(CelebrateDetailScreen);
export const CELEBRATE_DETAIL_SCREEN = 'nav/CELEBRATE_DETAIL_SCREEN';
