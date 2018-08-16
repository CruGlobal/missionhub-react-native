import React, { Component } from 'react';
import { SectionList } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleLike } from '../../actions/celebration';
import { DateComponent, Flex } from '../../components/common';
import CelebrateItem from '../../components/CelebrateItem';

import styles from './styles';

class CelebrateFeed extends Component {
  constructor(props) {
    super(props);
    // isListScrolled works around a known issue with SectionList in RN. see commit msg for details.
    this.state = { ...this.state, isListScrolled: false };
  }

  renderSectionHeader = ({ section: { date } }) => {
    const { title, header } = styles;

    return (
      <Flex style={header} align="center">
        <DateComponent date={date} format={'relative'} style={title} />
      </Flex>
    );
  };

  renderItem = ({ item }) => (
    <CelebrateItem
      event={item}
      myId={this.props.myId}
      onToggleLike={this.handleToggleLike}
    />
  );

  keyExtractor = item => item.id;

  handleOnEndReached = () => {
    if (this.state.isListScrolled) {
      this.props.loadMoreItemsCallback();
      this.setState({ isListScrolled: false });
    }
  };

  handleEndDrag = () => {
    if (!this.state.isListScrolled) {
      this.setState({ isListScrolled: true });
    }
  };

  handleRefreshing = () => {
    this.props.refreshCallback();
  };

  handleToggleLike = (eventId, liked) => {
    const { organization, dispatch } = this.props;
    dispatch(toggleLike(organization.id, eventId, liked));
  };

  render() {
    const { items, refreshing } = this.props;

    return (
      <SectionList
        sections={items}
        renderSectionHeader={this.renderSectionHeader}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        onEndReachedThreshold={0.2}
        onEndReached={this.handleOnEndReached}
        onScrollEndDrag={this.handleEndDrag}
        onRefresh={this.handleRefreshing}
        refreshing={refreshing || false}
      />
    );
  }
}

CelebrateFeed.propTypes = {
  items: PropTypes.array.isRequired,
  organization: PropTypes.object.isRequired,
  myId: PropTypes.string.isRequired,
  refreshing: PropTypes.bool,
};

export const mapStateToProps = ({ auth }) => ({
  myId: auth.person.id,
});

export default connect(mapStateToProps)(CelebrateFeed);
