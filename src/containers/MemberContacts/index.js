import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import CommentBox from '../../components/CommentBox';
import { Text, PlatformKeyboardAvoidingView } from '../../components/common';
import { getGroupCelebrateFeed } from '../../actions/celebration';
import { organizationSelector } from '../../selectors/organizations';
import { celebrationSelector } from '../../selectors/celebration';
import theme from '../../theme';

@translate('groupsCelebrate')
class MemberContacts extends Component {
  componentDidMount() {
    this.loadItems();
  }

  loadItems = () => {
    const { dispatch, organization } = this.props;
    dispatch(getGroupCelebrateFeed(organization.id));
  };

  submit = data => {
    return data;
  };

  render() {
    const { t } = this.props;
    return (
      <PlatformKeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.lightGrey }}
        offset={theme.headerHeight + theme.swipeTabHeight}
      >
        <ScrollView style={{ flex: 1 }}>
          <Text>Load More</Text>
          <Text>MEMBER Assigned Contacts LIST</Text>
        </ScrollView>
        <CommentBox
          placeholder={t('placeholder')}
          hideActions={true}
          onSubmit={this.submit}
        />
      </PlatformKeyboardAvoidingView>
    );
  }
}

export const mapStateToProps = ({ organizations }, { organization }) => ({
  organization,
});

export default connect(mapStateToProps)(MemberContacts);
