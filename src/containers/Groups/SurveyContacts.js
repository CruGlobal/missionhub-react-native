import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { navigatePush } from '../../actions/navigation';
import { searchPeople } from '../../actions/people';
import { Flex } from '../../components/common';
import SearchList from '../../components/SearchList';
import ContactItem from '../../components/ContactItem';
import Header from '../Header';
import BackButton from '../BackButton';

import { GROUPS_CONTACT } from './Contact';
import { SEARCH_SURVEY_CONTACTS_FILTER_SCREEN } from './SurveyContactsFilter';

@translate('groupsSurveyContacts')
class SurveyContacts extends Component {
  state = {
    filters: {},
  };

  handleRemoveFilter = async key => {
    let newFilters = { ...this.state.filters };
    delete newFilters[key];
    return await new Promise(resolve =>
      this.setState({ filters: newFilters }, () => resolve()),
    );
  };

  handleFilterPress = () => {
    const { dispatch, survey } = this.props;
    const { filters } = this.state;
    dispatch(
      navigatePush(SEARCH_SURVEY_CONTACTS_FILTER_SCREEN, {
        survey,
        onFilter: this.handleChangeFilter,
        filters,
      }),
    );
  };

  handleChangeFilter = filters => {
    this.setState({ filters }, () => {
      // Run the search every time a filter option changes
      if (this.searchList && this.searchList.getWrappedInstance) {
        this.searchList.getWrappedInstance().search();
      }
    });
  };

  handleSearch = async text => {
    const { dispatch } = this.props;
    const { filters } = this.state;

    const results = await dispatch(searchPeople(text, filters));
    // Get the results from the search endpoint
    return results.findAll('person') || [];
  };

  handleSelect = person => {
    const { dispatch, organization } = this.props;
    dispatch(navigatePush(GROUPS_CONTACT, { organization, person }));
  };

  render() {
    const { t, organization } = this.props;
    const { filters } = this.state;
    const orgName = organization ? organization.name : undefined;
    return (
      <Flex value={1}>
        <Header left={<BackButton />} title={orgName} />
        <SearchList
          ref={c => (this.searchList = c)}
          onFilterPress={this.handleFilterPress}
          listProps={{
            renderItem: ({ item }) => (
              <ContactItem contact={item} onSelect={this.handleSelect} />
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
