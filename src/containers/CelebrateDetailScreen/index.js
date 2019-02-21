import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { celebrationItemSelector } from '../../selectors/celebration';
import { Flex } from '../../components/common';
import CelebrateItem from '../../components/CelebrateItem';
import CommentsList from '../CommentsList';
import BackButton from '../BackButton';

import styles from './styles';

class CelebrateDetailScreen extends Component {
  render() {
    const { event } = this.props;
    const { container, cardStyle, backButtonStyle } = styles;

    return (
      <Flex value={1} justify="center" style={container}>
        <CelebrateItem
          event={event}
          cardStyle={cardStyle}
          rightCorner={
            <BackButton iconStyle={backButtonStyle} customIcon="deleteIcon" />
          }
        />
        <CommentsList
          eventId={event.id}
          organizationId={event.organization.id}
        />
      </Flex>
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
        params: { eventId, organizationId },
      },
    },
  },
) => ({
  event: celebrationItemSelector(
    { organizations },
    { eventId, organizationId },
  ),
});
export default connect(mapStateToProps)(CelebrateDetailScreen);
export const CELEBRATE_DETAIL_SCREEN = 'nav/CELEBRATE_DETAIL_SCREEN';
