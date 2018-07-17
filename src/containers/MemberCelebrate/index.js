import React, { Component } from 'react';
import { SectionList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import CommentBox from '../../components/CommentBox';
import CelebrateItem from '../../components/CelebrateItem';
import EmptyCelebrateFeed from '../../components/EmptyCelebrateFeed';
import {
  PlatformKeyboardAvoidingView,
  DateComponent,
  Flex,
} from '../../components/common';
import { getGroupCelebrateFeed } from '../../actions/celebration';
import { organizationSelector } from '../../selectors/organizations';
import { celebrationSelector } from '../../selectors/celebration';
import theme from '../../theme';
import styles from './styles';

@translate('celebrateFeeds')
class MemberCelebrate extends Component {
  componentDidMount() {
    this.loadItems();
  }

  loadItems = () => {
    const { dispatch, person, organization } = this.props;
    dispatch(getGroupCelebrateFeed(organization.id, person.id));
  };

  renderList() {
    const { t, celebrateItems, person } = this.props;
    const { title, header } = styles;

    return (
      <PlatformKeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.lightGrey }}
        offset={theme.headerHeight + theme.swipeTabHeight}
      >
        <SectionList
          sections={celebrateItems}
          renderSectionHeader={({ section: { date } }) => (
            <Flex style={header} align="center">
              <DateComponent date={date} format={'relative'} style={title} />
            </Flex>
          )}
          renderItem={({ item }) => (
            <CelebrateItem event={item} person={person} />
          )}
          keyExtractor={item => {
            return item.id;
          }}
        />
        <CommentBox
          placeholder={t('placeholder')}
          hideActions={true}
          onSubmit={this.submit}
        />
      </PlatformKeyboardAvoidingView>
    );
  }

  renderEmptyView() {
    const { person } = this.props;

    return <EmptyCelebrateFeed person={person} />;
  }

  render() {
    const { celebrateItems } = this.props;

    return celebrateItems.length === 0
      ? this.renderEmptyView()
      : this.renderList();
  }
}

const mapStateToProps = ({ organizations }, { organization, person }) => {
  const selectorOrg = organizationSelector(
    { organizations },
    { orgId: organization.id },
  );

  const filteredCelebrationItems = selectorOrg.celebrateItems.filter(
    item => item.subject_person.id === person.id,
  );

  const celebrateItems = celebrationSelector({
    celebrateItems: filteredCelebrationItems,
  });

  return {
    celebrateItems,
    pagination: organizations.celebratePagination,
  };
};

export default connect(mapStateToProps)(MemberCelebrate);
