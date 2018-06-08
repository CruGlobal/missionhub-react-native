import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Button, Flex, Text } from '../../components/common';
import {
  getGroupCelebrateFeed,
  getGroupCelebrateNextPage,
} from '../../actions/celebration';
import { organizationSelector } from '../../selectors/organizations';

@translate('groupsCelebrate')
class Celebrate extends Component {
  componentDidMount() {
    const { dispatch, organization } = this.props;
    dispatch(getGroupCelebrateFeed(organization.id));
  }

  handleLoadMore = () => {
    const { dispatch, organization } = this.props;
    dispatch(getGroupCelebrateNextPage(organization.id));
  };

  render() {
    return (
      <Flex value={1}>
        <ScrollView style={{ flex: 1 }}>
          <Text>Load More</Text>
          <Text>LONG LIST</Text>
        </ScrollView>
        <Flex justify="end">
          <Button
            type="secondary"
            onPress={this.handleLoadMore}
            text={'Input goes here'}
          />
        </Flex>
      </Flex>
    );
  }
}

export const mapStateToProps = ({ organizations }, { organization }) => {
  const selectorOrg = organizationSelector(
    { organizations },
    { orgId: organization.id },
  );
  console.log(selectorOrg);
  return {
    celebrateItems: (selectorOrg || {}).celebrateItems || [],
    pagination: organizations.celebratePagination,
  };
};

export default connect(mapStateToProps)(Celebrate);
