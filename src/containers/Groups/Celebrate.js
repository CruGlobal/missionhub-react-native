import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import CelebrateFeed from '../../components/CelebrateFeed';
import { getGroupCelebrateFeed } from '../../actions/celebration';
import { organizationSelector } from '../../selectors/organizations';
import { celebrationSelector } from '../../selectors/celebration';

@translate('groupsCelebrate')
export class Celebrate extends Component {
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
    const { celebrateItems } = this.props;
    return <CelebrateFeed items={celebrateItems} />;
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
