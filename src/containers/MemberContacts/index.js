import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import CommentBox from '../../components/CommentBox';
import { Text, PlatformKeyboardAvoidingView } from '../../components/common';
import theme from '../../theme';

@translate('groupsCelebrate')
class MemberContacts extends Component {
  renderEmpty() {
    <Text>Anyone assigned to this member will appear here.</Text>;
  }

  render() {
    const { t } = this.props;
    return (
      <ScrollView style={{ flex: 1 }}>
        <Text>Load More</Text>
        <Text>MEMBER Assigned Contacts LIST</Text>
      </ScrollView>
    );
  }
}

export default connect()(MemberContacts);
