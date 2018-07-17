import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import {
  Flex,
  DateComponent,
  PlatformKeyboardAvoidingView,
} from '../../components/common';
import CelebrateItem from '../../components/CelebrateItem';
import LoadMore from '../../components/LoadMore';
import CommentBox from '../../components/CommentBox';
import { getGroupCelebrateFeed } from '../../actions/celebration';
import { organizationSelector } from '../../selectors/organizations';
import { celebrationSelector } from '../../selectors/celebration';

import styles from './styles';

@translate('groupsCelebrate')
export class Celebrate extends Component {
  componentDidMount() {
    this.loadItems();
  }

  loadItems = () => {
    const { dispatch, organization } = this.props;
    dispatch(getGroupCelebrateFeed(organization.id));
  };

  renderSection = item => {
    return (
      <Flex align="center" justify="center">
        <DateComponent
          date={item.date}
          style={styles.cardSectionHeader}
          format="relative"
        />
        {item.events
          ? item.events.map(event => (
              <CelebrateItem key={event.id} event={event} />
            ))
          : null}
      </Flex>
    );
  };

  submit = data => {
    return data;
  };

  render() {
    const { t } = this.props;
    return (
      <PlatformKeyboardAvoidingView>
        <FlatList
          data={this.props.celebrateItems}
          keyExtractor={i => i.id}
          renderItem={({ item }) => this.renderSection(item)}
          style={styles.cardList}
          inverted={true}
          ListFooterComponent={<LoadMore onPress={this.loadItems} />}
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
