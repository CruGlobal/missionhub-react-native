import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { celebrationItemSelector } from '../../selectors/celebration';
import CelebrateItem from '../../components/CelebrateItem';
import CommentsList from '../CommentsList';
import BackButton from '../BackButton';
import CelebrateCommentBox from '../../components/CelebrateCommentBox';

import styles from './styles';

class CelebrateDetailScreen extends Component {
  render() {
    const { event } = this.props;
    const { container, cardStyle, backButtonStyle } = styles;

    return (
      <View style={container}>
        <CelebrateItem
          event={event}
          cardStyle={cardStyle}
          rightCorner={
            <BackButton iconStyle={backButtonStyle} customIcon="deleteIcon" />
          }
        />
        <CommentsList event={event} organizationId={event.organization.id} />
        <CelebrateCommentBox event={event} />
      </View>
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
