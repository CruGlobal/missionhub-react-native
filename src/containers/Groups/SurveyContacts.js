import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Separator, Flex, IconButton } from '../../components/common';
import SearchList from '../../components/SearchList';
import ContactItem from '../../components/ContactItem';
import Header from '../Header';
import BackButton from '../BackButton';

@connect()
@translate('groupsSurveyContacts')
class SurveyContacts extends Component {
  state = {
    filters: {
      filter1: { id: 'filter1', text: 'Last 30 days' },
      filter2: { id: 'filter2', text: 'Last 7 days' },
      filter3: { id: 'filter3', text: 'Filter 3' },
      filter4: { id: 'filter4', text: 'Filter 4' },
      filter5: { id: 'filter5', text: 'Filter 5' },
    },
  };

  handleRemoveFilter = async key => {
    let newFilters = { ...this.state.filters };
    delete newFilters[key];
    return await new Promise(resolve =>
      this.setState({ filters: newFilters }, () => resolve()),
    );
  };

  handleFilterPress = () => {
    // TODO: Navigate to the filters page, then change state when something is selected
    // TESTING
    this.setState({
      filters: {
        filter1: { id: 'filter1', text: 'Last 30 days' },
        filter2: { id: 'filter2', text: 'Last 7 days' },
        filter3: { id: 'filter3', text: 'Filter 3' },
        filter4: { id: 'filter4', text: 'Filter 4' },
        filter5: { id: 'filter5', text: 'Filter 5' },
      },
    });
  };

  handleSearch = text => {
    // TODO: Implement this
    return Promise.resolve(this.props.contacts);
  };

  handleSelect = item => {
    LOG('selected item', item);
  };

  render() {
    const { t, organization, survey } = this.props;
    const { filters } = this.state;
    const orgName = organization ? organization.name : undefined;
    return (
      <Flex value={1}>
        <Header left={<BackButton />} title={orgName} />
        <SearchList
          onFilterPress={this.handleFilterPress}
          listProps={{
            renderItem: ({ item }) => (
              <ContactItem contact={item} onSelect={this.handleSelect} />
            ),
            ItemSeparatorComponent: (sectionID, rowID) => (
              <Separator key={rowID} />
            ),
          }}
          onSearch={this.handleSearch}
          onRemoveFilter={this.handleRemoveFilter}
          filters={filters}
          placeholder={t('searchPlaceholder')}
        />
      </Flex>
    );
  }
}

SurveyContacts.propTypes = {
  organization: PropTypes.object.isRequired,
  survey: PropTypes.object.isRequired,
};

const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
  contacts: [
    { id: '1', full_name: 'full name 1', isAssigned: false },
    { id: '2', full_name: 'full name 2', isAssigned: false },
    { id: '3', full_name: 'full name 3', isAssigned: true },
    { id: '4', full_name: 'full name 4', isAssigned: false },
  ],
});

export default connect(mapStateToProps)(SurveyContacts);
export const GROUPS_SURVEY_CONTACTS = 'nav/GROUPS_SURVEY_CONTACTS';
