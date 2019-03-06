import React, { Component } from 'react';
import { View, SafeAreaView, StatusBar } from 'react-native';
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
import Header from '../../containers/Header';
import ItemHeaderText from '../../components/ItemHeaderText';
import { PARALLAX_HEADER_HEIGHT } from '../../constants';

import styles from './styles';

class CelebrateDetailScreen extends Component {
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

    return (
      <SafeAreaView style={container}>
        <StatusBar {...theme.statusBar.darkContent} />
        <ParallaxScrollView
          backgroundColor={theme.white}
          parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
          renderForeground={this.renderForeground}
          stickyHeaderHeight={theme.headerHeight}
          renderStickyHeader={this.renderStickyHeader}
        >
          <CommentsList event={event} organizationId={event.organization.id} />
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
