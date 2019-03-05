import React, { Component } from 'react';
import { View, SafeAreaView, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { celebrationItemSelector } from '../../selectors/celebration';
import CelebrateItem from '../../components/CelebrateItem';
import CommentsList from '../CommentsList';
import BackButton from '../BackButton';
import CelebrateCommentBox from '../../components/CelebrateCommentBox';
import theme from '../../theme';
import { navigatePush } from '../../actions/navigation';
import { EDIT_COMMENT_SCREEN } from '../EditCommentScreen';

import styles from './styles';

class CelebrateDetailScreen extends Component {
  handleEdit = item => {
    const { dispatch } = this.props;
    dispatch(navigatePush(EDIT_COMMENT_SCREEN, { item }));
  };

  render() {
    const { event } = this.props;
    const { container, cardStyle, backButtonStyle } = styles;

    return (
      <View style={container}>
        <StatusBar {...theme.statusBar.darkContent} />
        <CelebrateItem
          event={event}
          cardStyle={cardStyle}
          rightCorner={
            <BackButton iconStyle={backButtonStyle} customIcon="deleteIcon" />
          }
          namePressable={true}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <CommentsList
            event={event}
            organizationId={event.organization.id}
            onEdit={this.handleEdit}
          />
          <CelebrateCommentBox event={event} />
        </SafeAreaView>
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
