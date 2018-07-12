import React, { Component } from 'react';
import { ScrollView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import CommentBox from '../../components/CommentBox';
import CelebrationFeedItem from '../../components/CelebrationFeedItem';
import { Text, PlatformKeyboardAvoidingView } from '../../components/common';
import { getGroupCelebrateFeed } from '../../actions/celebration';
import { organizationSelector } from '../../selectors/organizations';
import { celebrationSelector } from '../../selectors/celebration';
import theme from '../../theme';

@translate('groupsCelebrate')
class MemberCelebrate extends Component {
  componentDidMount() {
    this.loadItems();
  }

  loadItems = () => {
    const { dispatch, person, organization } = this.props;
    dispatch(getGroupCelebrateFeed(organization.id, person.id));
  };

  render() {
    const { t, celebrateItems } = this.props;

    return (
      <PlatformKeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.lightGrey }}
        offset={theme.headerHeight + theme.swipeTabHeight}
      >
        <FlatList
          data={celebrateItems}
          renderItem={({ item }) => (
            <CelebrationFeedItem date={item.date} message=" " likes="0" />
          )}
        />
        <CommentBox
          placeholder={t('placeholder')}
          hideActions={true}
          onSubmit={this.submit}
        />
      </PlatformKeyboardAvoidingView>
    );
  }
}

export const mapStateToProps = (
  { organizations },
  { organization, person },
) => {
  const selectorOrg = organizationSelector(
    { organizations },
    { orgId: organization.id },
  );

  const filteredCelebrationItems = (
    (selectorOrg || {}).celebrateItems || []
  ).filter(item => {
    return item.subject_person.id === person.id;
  });

  const celebrateItems = celebrationSelector({
    celebrateItems: filteredCelebrationItems,
  });

  return {
    celebrateItems,
    pagination: organizations.celebratePagination,
  };
};

export default connect(mapStateToProps)(MemberCelebrate);
