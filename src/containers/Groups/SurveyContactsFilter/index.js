import React, { Component } from 'react';
import { View, ScrollView, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { navigatePush } from '../../../actions/navigation';
import { getMySurveys } from '../../../actions/surveys';
import Header from '../../Header';
import FilterItem from '../../../components/FilterItem';
import { buildTrackingObj, isString } from '../../../utils/common';
import { SEARCH_REFINE_SCREEN } from '../../SearchPeopleFilterRefineScreen';
import { trackSearchFilter } from '../../../actions/analytics';
import BackButton from '../../BackButton';

import styles from './styles';

@translate('searchFilter')
export class SurveyContactsFilter extends Component {
  constructor(props) {
    super(props);
    const { t, filters } = props;

    const options = [
      {
        id: 'questions',
        text: t('surveyQuestions'),
        options: 'questions',
        preview: filters.questions ? filters.questions.text : undefined,
      },
      {
        id: 'gender',
        text: t('gender'),
        options: [
          { id: 'm', text: t('male') },
          { id: 'f', text: t('female') },
          { id: 'o', text: t('other') },
        ],
        preview: filters.gender ? filters.gender.text : undefined,
      },
      {
        id: 'time',
        text: t('time'),
        options: [
          { id: 'time7', text: t('time7') },
          { id: 'time30', text: t('time30') },
          { id: 'time60', text: t('time60') },
          { id: 'time90', text: t('time90') },
          { id: 'time180', text: t('time180') },
          { id: 'time270', text: t('time270') },
          { id: 'time365', text: t('time365') },
        ],
        preview: filters.time ? filters.time.text : undefined,
      },
    ];
    const toggleOptions = [
      {
        id: 'uncontacted',
        text: t('uncontacted'),
        selected: !!filters.uncontacted,
      },
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
    };
  }

  componentWillMount() {
    // If we haven't requested any of this info, or none exists, go ahead and get it
    // if (!this.props.surveys.length) {
    //   this.props.dispatch(getSurveyQuestions());
    // }
    Keyboard.dismiss();
  }

  loadSurveys() {
    return this.props.dispatch(getMySurveys());
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
    return (
      <View style={styles.pageContainer}>
        <Header left={<BackButton />} title={t('titleSurvey')} />
        <ScrollView style={{ flex: 1 }}>
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

SurveyContactsFilter.propTypes = {
  onFilter: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  survey: PropTypes.object.isRequired,
};

const mapStateToProps = (reduxState, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(SurveyContactsFilter);
export const SEARCH_SURVEY_CONTACTS_FILTER_SCREEN =
  'nav/SEARCH_SURVEY_CONTACTS_FILTER';
