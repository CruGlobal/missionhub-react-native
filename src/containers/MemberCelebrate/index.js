import React, { Component } from 'react';
import { SectionList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import CelebrateFeed from '../../components/CelebrateFeed';
import EmptyCelebrateFeed from '../../components/EmptyCelebrateFeed';

import { getGroupCelebrateFeed } from '../../actions/celebration';
import { organizationSelector } from '../../selectors/organizations';
import { celebrationSelector } from '../../selectors/celebration';

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
    const { celebrateItems } = this.props;

    return (
      <CelebrateFeed
        items={celebrateItems}
        loadMoreItemsCallback={() => this.loadItems()}
      />
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

  const filteredCelebrationItems = (selectorOrg.celebrateItems || []).filter(
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
