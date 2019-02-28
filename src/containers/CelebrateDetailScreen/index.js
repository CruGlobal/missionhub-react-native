import React, { Component } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { celebrationItemSelector } from '../../selectors/celebration';
import CelebrateItem from '../../components/CelebrateItem';
import CommentsList from '../CommentsList';
import BackButton from '../BackButton';
import CelebrateCommentBox from '../../components/CelebrateCommentBox';
import theme from '../../theme';
import { deleteCelebrateComment } from '../../actions/celebrateComments';

import styles from './styles';

class CelebrateDetailScreen extends Component {
  handleDelete = item => {
    const { dispatch, event } = this.props;
    dispatch(deleteCelebrateComment(event, item));
  };

  render() {
    const { event } = this.props;
    const { container, cardStyle, backButtonStyle } = styles;

    return (
      <SafeAreaView style={container}>
        <StatusBar {...theme.statusBar.darkContent} />
        <CelebrateItem
          event={event}
          cardStyle={cardStyle}
          rightCorner={
            <BackButton iconStyle={backButtonStyle} customIcon="deleteIcon" />
          }
          namePressable={true}
        />
        <CommentsList
          event={event}
          organizationId={event.organization.id}
          onDelete={this.handleDelete}
        />
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
