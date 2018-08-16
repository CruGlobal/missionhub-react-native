import React, { Component } from 'react';
import { View, ScrollView, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { navigatePush } from '../../actions/navigation';
import { getMyOrganizations } from '../../actions/organizations';
import { getMyGroups } from '../../actions/groups';
import { getMySurveys } from '../../actions/surveys';
import { getMyLabels } from '../../actions/labels';
import Header from '../Header';
import { RefreshControl } from '../../components/common';
import FilterItem from '../../components/FilterItem';
import { buildTrackingObj, isString } from '../../utils/common';
import { SEARCH_REFINE_SCREEN } from '../SearchPeopleFilterRefineScreen';
import { trackSearchFilter } from '../../actions/analytics';
import BackButton from '../BackButton';

import styles from './styles';

@translate('searchFilter')
export class SearchPeopleFilterScreen extends Component {
  constructor(props) {
    super(props);
    const { t, filters } = props;

    const options = [
      {
        id: 'ministry',
        text: t('ministry'),
        options: 'organizations',
        preview: props.filters.ministry
          ? props.filters.ministry.text
          : undefined,
      },
      {
        id: 'labels',
        text: t('label'),
        options: 'labels',
        preview: props.filters.labels ? props.filters.labels.text : undefined,
      },
      {
        id: 'groups',
        text: t('groups'),
        options: 'groups',
        preview: props.filters.groups ? props.filters.groups.text : undefined,
      },
      {
        id: 'gender',
        text: t('gender'),
        options: [
          { id: 'm', text: t('male') },
          { id: 'f', text: t('female') },
          { id: 'o', text: t('other') },
        ],
        preview: props.filters.gender ? props.filters.gender.text : undefined,
      },
      {
        id: 'surveys',
        text: t('surveys'),
        options: 'surveys',
        preview: props.filters.surveys ? props.filters.surveys.text : undefined,
      },
    ];
    const toggleOptions = [
      {
        id: 'unassigned',
        text: t('unassigned'),
        selected: !!filters.unassigned,
      },
      {
        id: 'archived',
        text: t('archived'),
        selected: !!filters.archived,
      },
    ];
    this.state = {
      filters: filters,
      options,
      toggleOptions,
      selectedFilterId: '',
      refreshing: false,
    };

    this.reloadAll = this.reloadAll.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleDrillDown = this.handleDrillDown.bind(this);
    this.handleSelectFilter = this.handleSelectFilter.bind(this);
  }

  componentDidMount() {
    // If we haven't requested any of this info, or none exists, go ahead and get it
    if (!this.props.organizations.length) {
      this.props.dispatch(getMyOrganizations());
    }
    if (!this.props.groups.length) {
      this.props.dispatch(getMyGroups());
    }
    if (!this.props.surveys.length) {
      this.props.dispatch(getMySurveys());
    }
    if (!this.props.labels.length) {
      this.props.dispatch(getMyLabels());
    }
    Keyboard.dismiss();
  }

  reloadAll() {
    this.setState({ refreshing: true });
    Promise.all([
      this.loadOrgs(),
      this.loadGroups(),
      this.loadSurveys(),
      this.loadLabels(),
    ])
      .then(() => {
        this.setState({ refreshing: false });
      })
      .catch(() => {
        this.setState({ refreshing: false });
      });
  }

  loadOrgs() {
    return this.props.dispatch(getMyOrganizations());
  }

  loadGroups() {
    return this.props.dispatch(getMyGroups());
  }

  loadSurveys() {
    return this.props.dispatch(getMySurveys());
  }

  loadLabels() {
    return this.props.dispatch(getMyLabels());
  }

  setFilter(filters = {}) {
    this.setState({ filters });
    this.props.onFilter(filters);
  }

  handleDrillDown(item) {
    // Pull the options from the props that were not loaded when this was initialized
    const options =
      isString(item.options) && this.props[item.options]
        ? this.props[item.options]
        : item.options;
    this.props.dispatch(
      navigatePush(SEARCH_REFINE_SCREEN, {
        onFilter: this.handleSelectFilter,
        title: item.text,
        options,
        filters: this.state.filters,
        trackingObj: buildTrackingObj(
          `search : refine : ${item.id}`,
          'search',
          'refine',
          item.id,
        ),
      }),
    );
    this.setState({ selectedFilterId: item.id });

    this.props.dispatch(trackSearchFilter(item.id));
  }

  handleToggle(item) {
    if (!item) {
      return;
    }
    let newFilter = { ...this.state.filters };
    const field = item.id;
    const newValue = !item.selected;
    newFilter[field] = newValue ? item : undefined;
    const toggleOptions = this.state.toggleOptions.map(o => ({
      ...o,
      selected: o.id === item.id ? newValue : o.selected,
    }));
    this.setState({ toggleOptions });
    this.setFilter(newFilter);
  }

  handleSelectFilter(item) {
    const newOptions = this.state.options.map(o => ({
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
    const { t } = this.props;
    return (
      <View style={styles.pageContainer}>
        <Header left={<BackButton />} title={t('title')} />
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.reloadAll}
            />
          }
        >
          {this.state.options.map(o => (
            <FilterItem
              key={o.id}
              item={o}
              onSelect={this.handleDrillDown}
              type="drilldown"
            />
          ))}
          {this.state.toggleOptions.map(o => (
            <FilterItem
              key={o.id}
              item={o}
              onSelect={this.handleToggle}
              type="switch"
              isSelected={o.selected}
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}

SearchPeopleFilterScreen.propTypes = {
  onFilter: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
};

const mapStateToProps = (
  { organizations, groups, surveys, labels },
  { navigation },
) => ({
  ...(navigation.state.params || {}),
  organizations: organizations.all,
  groups: groups.all,
  surveys: surveys.all,
  labels: labels.all,
});

export default connect(mapStateToProps)(SearchPeopleFilterScreen);
export const SEARCH_FILTER_SCREEN = 'nav/SEARCH_FILTER';
