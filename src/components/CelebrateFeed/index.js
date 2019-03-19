import React, { Component, Fragment } from 'react';
import { SectionList } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { DateComponent, Flex } from '../../components/common';
import CelebrateItem from '../../components/CelebrateItem';
import OnboardingCard, {
  GROUP_ONBOARDING_TYPES,
} from '../../containers/Groups/OnboardingCard';
import { CELEBRATE_DETAIL_SCREEN } from '../../containers/CelebrateDetailScreen';
import { navigatePush } from '../../actions/navigation';
import { GLOBAL_COMMUNITY_ID } from '../../constants';
import ReportCommentNotifier from '../../containers/ReportCommentNotifier';

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

  onPressItem = event => {
    const { dispatch } = this.props;

    dispatch(
      navigatePush(CELEBRATE_DETAIL_SCREEN, {
        event,
      }),
    );
  };

  renderItem = ({ item }) => {
    const { organization, itemNamePressable } = this.props;

    return (
      <CelebrateItem
        event={item}
        onPressItem={
          organization.id !== GLOBAL_COMMUNITY_ID && this.onPressItem
        }
        namePressable={itemNamePressable}
      />
    );
  };

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

  renderHeader = () => (
    <Fragment>
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.celebrate} />
      <ReportCommentNotifier organization={this.props.organization} />
    </Fragment>
  );

  render() {
    const { items, refreshing } = this.props;

    return (
      <SectionList
        sections={items}
        ListHeaderComponent={this.renderHeader}
        renderSectionHeader={this.renderSectionHeader}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        onEndReachedThreshold={0.2}
        onEndReached={this.handleOnEndReached}
        onScrollEndDrag={this.handleEndDrag}
        onRefresh={this.handleRefreshing}
        refreshing={refreshing || false}
        extraData={this.state}
        contentContainerStyle={styles.list}
      />
    );
  }
}

CelebrateFeed.propTypes = {
  items: PropTypes.array.isRequired,
  organization: PropTypes.object.isRequired,
  refreshing: PropTypes.bool,
  itemNamePressable: PropTypes.bool,
};

export default connect()(CelebrateFeed);
