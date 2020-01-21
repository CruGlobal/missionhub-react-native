import React, { Component } from 'react';
import { View, ScrollView, Keyboard } from 'react-native';
import { connect } from 'react-redux-legacy';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { navigatePush } from '../../../actions/navigation';
import Header from '../../../components/Header';
import FilterItem from '../../../components/FilterItem';
import { buildTrackingObj, isString } from '../../../utils/common';
import {
  getFilterOptions,
  searchHandleToggle,
  searchSelectFilter,
} from '../../../utils/filters';
import { SEARCH_REFINE_SCREEN } from '../../SearchPeopleFilterRefineScreen';
import { trackSearchFilter } from '../../../actions/analytics';
import { getOrgFilterStats } from '../../../actions/labels';
import BackButton from '../../BackButton';

import styles from './styles';

// @ts-ignore
@withTranslation('searchFilter')
export class ContactsFilter extends Component {
  // @ts-ignore
  constructor(props) {
    super(props);
    const { filters } = props;

    const { options, toggleOptions } = this.createFilterOptions([]);

    this.state = {
      filters,
      options,
      toggleOptions,
      selectedFilterId: '',
    };
  }

  componentDidMount() {
    // If we haven't requested any of this info, or none exists, go ahead and get it
    Keyboard.dismiss();
    this.loadLabels();
  }

  async loadLabels() {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    const filterStats = await dispatch(getOrgFilterStats(organization.id));

    const { options, toggleOptions } = this.createFilterOptions(filterStats);
    this.setState({ options, toggleOptions });
  }

  // @ts-ignore
  createFilterOptions(filterStats) {
    // @ts-ignore
    const { t, filters } = this.props;
    const filterOptions = getFilterOptions(t, filters, [], filterStats);
    const options = [
      filterOptions.labels,
      filterOptions.gender,
      // TODO: remove until API supports it
      // filterOptions.time,
    ];
    const toggleOptions = [
      filterOptions.uncontacted,
      filterOptions.unassigned,
      filterOptions.archived,
    ];
    return { options, toggleOptions };
  }

  // @ts-ignore
  handleDrillDown = item => {
    // Pull the options from the props that were not loaded when this was initialized
    const options =
      // @ts-ignore
      isString(item.options) && this.props[item.options]
        ? // prettier-ignore
          // @ts-ignore
          this.props[item.options]
        : item.options;
    // @ts-ignore
    this.props.dispatch(
      navigatePush(SEARCH_REFINE_SCREEN, {
        onFilter: this.handleSelectFilter,
        title: item.text,
        options,
        // @ts-ignore
        filters: this.state.filters,
        // @ts-ignore
        trackingObj: buildTrackingObj(
          `search : refine : ${item.id}`,
          'search',
          'refine',
          item.id,
        ),
      }),
    );
    this.setState({ selectedFilterId: item.id });

    // @ts-ignore
    this.props.dispatch(trackSearchFilter(item.id));
  };

  // @ts-ignore
  handleToggle = item => {
    searchHandleToggle(this, item);
  };

  // @ts-ignore
  handleSelectFilter = item => {
    searchSelectFilter(this, item);
  };

  render() {
    // @ts-ignore
    const { t } = this.props;
    // @ts-ignore
    const { options, toggleOptions } = this.state;
    return (
      <View style={styles.pageContainer}>
        <Header left={<BackButton />} title={t('title')} />
        <ScrollView style={styles.list}>
          // @ts-ignore
          {options.map(o => (
            <FilterItem
              key={o.id}
              item={o}
              onSelect={this.handleDrillDown}
              type="drilldown"
            />
          ))}
          // @ts-ignore
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

// @ts-ignore
ContactsFilter.propTypes = {
  onFilter: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
};

// @ts-ignore
const mapStateToProps = (reduxState, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(ContactsFilter);
export const SEARCH_CONTACTS_FILTER_SCREEN = 'nav/SEARCH_CONTACTS_FILTER';
