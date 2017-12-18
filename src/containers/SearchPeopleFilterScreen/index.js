import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { navigateBack, navigatePush } from '../../actions/navigation';
// import { getMyOrganizations } from '../../actions/organizations';
// import { getMyGroups } from '../../actions/groups';
// import { getMySurveys } from '../../actions/surveys';

import Header from '../Header';
import { IconButton } from '../../components/common';
import FilterItem from '../../components/FilterItem';
import styles from './styles';


export class SearchPeopleFilterScreen extends Component {

  constructor(props) {
    super(props);

    const options = [
      {
        id: 'ministry',
        text: 'Ministry',
        options: this.props.all,
        preview: props.filters.ministry ? props.filters.ministry.text : undefined,
      },
      {
        id: 'labels',
        text: 'Labels',
        options: this.props.all,
        preview: props.filters.labels ? props.filters.labels.text : undefined,
      },
      {
        id: 'groups',
        text: 'Groups',
        options: this.props.groups,
        preview: props.filters.groups ? props.filters.groups.text : undefined,
      },
      {
        id: 'gender',
        text: 'Gender',
        options: [
          { id: 'm', text: 'Male' },
          { id: 'f', text: 'Female' },
        ],
        preview: props.filters.gender ? props.filters.gender.text : undefined,
      },
      { 
        id: 'survey',
        text: 'Survey',
        // options: this.props.surveys,
        options: [
          { id: 'survey1', text: 'Survey 1' },
          { id: 'survey2', text: 'Survey 2' },
          {
            id: 'survey3',
            text: 'Survey 3',
            drilldown: [
              { id: 'survey4', text: 'Survey 4' },
              { id: 'survey5', text: 'Survey 5' },
            ],
          },
        ],
        preview: props.filters.survey ? props.filters.survey.text : undefined,
      },
    ];
    const toggleOptions = [
      {
        id: 'unassigned',
        text: 'Unassigned',
        selected: !!props.filters.unassigned,
      },
      {
        id: 'archived',
        text: 'Include Archived Contacts',
        selected: !!props.filters.archived,
      },
    ];
    this.state = {
      filters: props.filters,
      options,
      toggleOptions,
      selectedFilterId: '',
    };

    this.handleToggle = this.handleToggle.bind(this);
    this.handleDrillDown = this.handleDrillDown.bind(this);
    this.handleSelectFilter = this.handleSelectFilter.bind(this);
  }

  componentWillMount() {
    // if (!this.props.organizations) {
    //   this.props.dispatch(getMyOrganizations());
    // }
    // if (!this.props.groups) {
    //   this.props.dispatch(getMyGroups());
    // }
    // if (!this.props.surveys) {
    //   this.props.dispatch(getMySurveys());
    // }
  }

  setFilter(filters = {}) {
    this.setState({ filters });
    this.props.onFilter(filters);
  }

  handleDrillDown(item) {
    this.props.dispatch(navigatePush('SearchPeopleFilterRefine', {
      onFilter: this.handleSelectFilter,
      title: item.text,
      options: item.options,
      filters: this.state.filters,
    }));
    this.setState({ selectedFilterId: item.id });
  }

  handleToggle(item) {
    if (!item) return;
    let newFilter = { ...this.state.filters };
    const field = item.id;
    const newValue = !item.selected;
    newFilter[field] = newValue ? item : undefined;
    const toggleOptions = this.state.toggleOptions.map((o) => ({
      ...o,
      selected: o.id === item.id ? newValue : o.selected,
    }));
    this.setState({ toggleOptions });
    this.setFilter(newFilter);
  }

  handleSelectFilter(item) {
    const newOptions = this.state.options.map((o) => ({
      ...o,
      preview: o.id === this.state.selectedFilterId ? item.text : o.preview,
    }));
    let filters = {
      ...this.state.filters,
      [this.state.selectedFilterId]: item,
    };
    if (item.id === 'any') {
      delete filters[this.state.selectedFilterId];
    }
    this.setState({ options: newOptions });
    this.setFilter(filters);
  }

  render() {
    return (
      <View style={styles.pageContainer}>
        <Header
          left={
            <IconButton
              name="backIcon"
              type="MissionHub"
              onPress={() => this.props.dispatch(navigateBack())} />
          }
          title="Filter"
        />
        <ScrollView style={{ flex: 1 }}>
          {
            this.state.options.map((o) => (
              <FilterItem
                key={o.id}
                item={o}
                onSelect={this.handleDrillDown}
                type="drilldown"
              />
            ))
          }
          {
            this.state.toggleOptions.map((o) => (
              <FilterItem
                key={o.id}
                item={o}
                onSelect={this.handleToggle}
                type="switch"
                isSelected={o.selected}
              />
            ))
          }
        </ScrollView>
      </View>
    );
  }
}

SearchPeopleFilterScreen.propTypes = {
  onFilter: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
};

const mapStateToProps = ({ organizations, groups, surveys }, { navigation }) => ({
  ...(navigation.state.params || {}),
  organizations: organizations.all,
  groups: groups.all,
  surveys: surveys.all,
});

export default connect(mapStateToProps)(SearchPeopleFilterScreen);
