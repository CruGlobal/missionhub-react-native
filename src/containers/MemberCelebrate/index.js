import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import CommentBox from '../../components/CommentBox';
import { Text, PlatformKeyboardAvoidingView } from '../../components/common';
import theme from '../../theme';

@translate('groupsCelebrate')
class MemberCelebrate extends Component {
  render() {
    const { t } = this.props;
    return (
      <PlatformKeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.lightGrey }}
        offset={theme.headerHeight + theme.swipeTabHeight}
      >
        <ScrollView style={{ flex: 1 }}>
          <Text>Load More</Text>
          <Text>MEMBER Celebrate LIST</Text>
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

export const mapStateToProps = (_, { organization }) => ({
  organization,
});

export default connect(mapStateToProps)(MemberCelebrate);
