import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import CommentBox from '../../components/CommentBox';
import {
  Flex,
  Text,
  PlatformKeyboardAvoidingView,
} from '../../components/common';
import { getGroupCelebrateFeed } from '../../actions/celebration';
import { organizationSelector } from '../../selectors/organizations';
import { celebrationSelector } from '../../selectors/celebration';

import styles from './styles';

@translate('groupsCelebrate')
class Celebrate extends Component {
  componentDidMount() {
    this.loadItems();
  }

  loadItems = () => {
    const { dispatch, organization } = this.props;
    dispatch(getGroupCelebrateFeed(organization.id));
  };

  submit = data => {
    LOG('submitting', data);
  };

  render() {
    return (
      <PlatformKeyboardAvoidingView style={styles.celebrate}>
        <ScrollView style={{ flex: 1 }}>
          <Text>Load More</Text>
          <Text>LONG LIST</Text>
        </ScrollView>
        <Flex justify="end">
          <CommentBox onSubmit={this.submit} />
        </Flex>
      </PlatformKeyboardAvoidingView>
    );
  }
}

export const mapStateToProps = ({ organizations }, { organization }) => {
  const selectorOrg = organizationSelector(
    { organizations },
    { orgId: organization.id },
  );

  const celebrateItems = celebrationSelector({
    celebrateItems: (selectorOrg || {}).celebrateItems || [],
  });

  return {
    celebrateItems,
    pagination: organizations.celebratePagination,
  };
};

export default connect(mapStateToProps)(Celebrate);
