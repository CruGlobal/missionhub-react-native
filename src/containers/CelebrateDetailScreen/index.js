import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { celebrationItemSelector } from '../../selectors/celebration';
import { Flex } from '../../components/common';
import CelebrateItem from '../../components/CelebrateItem';
import CommentsList from '../CommentsList';
import theme from '../../theme';
import { hasNotch } from '../../utils/common';
import BackButton from '../BackButton';

class CelebrateDetailScreen extends Component {
  render() {
    const { event } = this.props;

    return (
      <Flex
        value={1}
        justify="center"
        style={{
          backgroundColor: theme.white,
        }}
      >
        <CelebrateItem
          event={event}
          cardStyle={{
            shadowOpacity: 0,
            shadowRadius: 0,
            marginHorizontal: 3,
            marginTop: hasNotch() ? 50 : 25,
          }}
          rightCorner={
            <BackButton
              iconStyle={{ color: theme.black }}
              customIcon="deleteIcon"
            />
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
