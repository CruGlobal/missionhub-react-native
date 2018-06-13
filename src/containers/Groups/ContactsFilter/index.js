import React, { Component } from 'react';
import { View, ScrollView, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { navigatePush } from '../../../actions/navigation';
import Header from '../../Header';
import FilterItem from '../../../components/FilterItem';
import { buildTrackingObj, isString } from '../../../utils/common';
import { SEARCH_REFINE_SCREEN } from '../../SearchPeopleFilterRefineScreen';
import { trackSearchFilter } from '../../../actions/analytics';
import BackButton from '../../BackButton';

export const getFilterOptions = (t, filters) => ({
  gender: {
    id: 'gender',
    text: t('searchFilter:gender'),
    options: [
      { id: 'm', text: t('searchFilter:male') },
      { id: 'f', text: t('searchFilter:female') },
      { id: 'o', text: t('searchFilter:other') },
    ],
    preview: filters.gender ? filters.gender.text : undefined,
  },
  time: {
    id: 'time',
    text: t('searchFilter:time'),
    options: [
      { id: 'time7', text: t('searchFilter:time7') },
      { id: 'time30', text: t('searchFilter:time30') },
      { id: 'time60', text: t('searchFilter:time60') },
      { id: 'time90', text: t('searchFilter:time90') },
      { id: 'time180', text: t('searchFilter:time180') },
      { id: 'time270', text: t('searchFilter:time270') },
      { id: 'time365', text: t('searchFilter:time365') },
    ],
    preview: filters.time ? filters.time.text : undefined,
  },
  uncontacted: {
    id: 'uncontacted',
    text: t('searchFilter:uncontacted'),
    selected: !!filters.uncontacted,
  },
  unassigned: {
    id: 'unassigned',
    text: t('searchFilter:unassigned'),
    selected: !!filters.unassigned,
  },
  archived: {
    id: 'archived',
    text: t('searchFilter:archived'),
    selected: !!filters.archived,
  },
});

import styles from './styles';

@translate('searchFilter')
export class ContactsFilter extends Component {
  constructor(props) {
    super(props);
    const { t, filters } = props;

    const filterOptions = getFilterOptions(t, filters);
    const options = [filterOptions.gender, filterOptions.time];
    const toggleOptions = [
      filterOptions.uncontacted,
      filterOptions.unassigned,
      filterOptions.archived,
    ];
    this.state = {
      filters: filters,
      options,
      toggleOptions,
      selectedFilterId: '',
    };
  }

  componentWillMount() {
    // If we haven't requested any of this info, or none exists, go ahead and get it
    // if (!this.props.surveys.length) {
    //   this.props.dispatch(getSurveyQuestions());
    // }
    Keyboard.dismiss();
  }

  setFilter(filters = {}) {
    this.setState({ filters });
    this.props.onFilter(filters);
  }

  handleDrillDown = item => {
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
  };

  handleToggle = item => {
    const { toggleOptions, filters } = this.state;
    if (!item) return;
    let newFilter = { ...filters };
    const field = item.id;
    const newValue = !item.selected;
    newFilter[field] = newValue ? item : undefined;
    const newToggleOptions = toggleOptions.map(o => ({
      ...o,
      selected: o.id === item.id ? newValue : o.selected,
    }));
    this.setState({ toggleOptions: newToggleOptions });
    this.setFilter(newFilter);
  };

  handleSelectFilter = item => {
    const { options, selectedFilterId, filters } = this.state;
    const newOptions = options.map(o => ({
      ...o,
      preview: o.id === selectedFilterId ? item.text : o.preview,
    }));
    let newFilters = {
      ...filters,
      [selectedFilterId]: item,
    };
    if (item.id === 'any') {
      delete newFilters[selectedFilterId];
    }
    this.setState({ options: newOptions });
    this.setFilter(newFilters);
  };

  render() {
    const { t } = this.props;
    const { options, toggleOptions } = this.state;
    return (
      <View style={styles.pageContainer}>
        <Header left={<BackButton />} title={t('titleSurvey')} />
        <ScrollView style={{ flex: 1 }}>
          {options.map(o => (
            <FilterItem
              key={o.id}
              item={o}
              onSelect={this.handleDrillDown}
              type="drilldown"
            />
          ))}
          {toggleOptions.map(o => (
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

ContactsFilter.propTypes = {
  onFilter: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
};

const mapStateToProps = (reduxState, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(ContactsFilter);
export const SEARCH_CONTACTS_FILTER_SCREEN = 'nav/SEARCH_CONTACTS_FILTER';
