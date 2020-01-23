import React, { Component } from 'react';
import { Keyboard } from 'react-native';
import { connect } from 'react-redux-legacy';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { navigatePush } from '../../../actions/navigation';
import {
  getSurveyQuestions,
  getSurveyFilterStats,
} from '../../../actions/surveys';
import { buildTrackingObj, isString } from '../../../utils/common';
import {
  getFilterOptions,
  searchHandleToggle,
  searchSelectFilter,
} from '../../../utils/filters';
import { SEARCH_REFINE_SCREEN } from '../../SearchPeopleFilterRefineScreen';
import { trackSearchFilter } from '../../../actions/analytics';
import FilterList from '../../../components/FilterList';
import { SEARCH_QUESTIONS_FILTER_SCREEN } from '../SurveyQuestionsFilter';

// @ts-ignore
@withTranslation('searchFilter')
export class SurveyContactsFilter extends Component {
  // @ts-ignore
  constructor(props) {
    super(props);
    const { filters } = props;

    const { options, toggleOptions } = this.createFilterOptions([], []);

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
    this.loadQuestionsAndLabels();
  }

  async loadQuestionsAndLabels() {
    // @ts-ignore
    const { dispatch, survey } = this.props;
    const questions = await dispatch(getSurveyQuestions(survey.id));
    const filterStats = await dispatch(getSurveyFilterStats(survey.id));

    const { options, toggleOptions } = this.createFilterOptions(
      questions,
      filterStats,
    );
    this.setState({ options, toggleOptions });
  }

  // @ts-ignore
  createFilterOptions(questions, filterStats) {
    // @ts-ignore
    const { t, filters } = this.props;
    const filterOptions = getFilterOptions(t, filters, questions, filterStats);

    const options = [
      filterOptions.questions,
      filterOptions.labels,
      filterOptions.gender,
      filterOptions.time,
    ];
    const toggleOptions = [
      filterOptions.uncontacted,
      filterOptions.unassigned,
      filterOptions.archived,
      filterOptions.includeUsers,
    ];
    return { options, toggleOptions };
  }

  // @ts-ignore
  handleDrillDown = item => {
    // Pull the options from the props that were not loaded when this was initialized
    const options =
      // @ts-ignore
      (isString(item.options) && this.props[item.options]) || item.options;

    const isQuestion = item.id === 'questions';
    const nextPage = isQuestion
      ? SEARCH_QUESTIONS_FILTER_SCREEN
      : SEARCH_REFINE_SCREEN;
    const onFilter = isQuestion
      ? this.handleSelectQuestionFilters
      : this.handleSelectFilter;
    const filters = isQuestion
      ? // @ts-ignore
        this.state.filters.questions || {}
      : // @ts-ignore
        this.state.filters;

    // @ts-ignore
    this.props.dispatch(
      navigatePush(nextPage, {
        onFilter,
        title: item.text,
        options,
        filters,
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

  // @ts-ignore
  handleSelectQuestionFilters = item => {
    // @ts-ignore
    const { options, selectedFilterId, filters } = this.state;
    // @ts-ignore
    const { t } = this.props;
    const itemKeys = Object.keys(item);
    const filterKeys = Object.keys(filters);
    // @ts-ignore
    const newOptions = options.map(o => ({
      ...o,
      preview:
        o.id === selectedFilterId
          ? itemKeys.length > 1
            ? t('multiple')
            : item[itemKeys[0]].text
          : o.preview,
    }));
    //remove all existing answer filters,
    //then add all answer filters from item
    let newFilters = filters;
    filterKeys.forEach(k => {
      if (newFilters[k] && newFilters[k].isAnswer) {
        delete newFilters[k];
      }
    });
    newFilters = {
      ...newFilters,
      ...item,
    };

    this.setState({ options: newOptions, filters: newFilters });
    // @ts-ignore
    this.props.onFilter(newFilters);
  };

  render() {
    // @ts-ignore
    const { t } = this.props;
    // @ts-ignore
    const { options, toggleOptions } = this.state;
    return (
      <FilterList
        onDrillDown={this.handleDrillDown}
        onToggle={this.handleToggle}
        options={options}
        toggleOptions={toggleOptions}
        title={t('titleSurvey')}
      />
    );
  }
}

// @ts-ignore
SurveyContactsFilter.propTypes = {
  onFilter: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  survey: PropTypes.object.isRequired,
};

// @ts-ignore
const mapStateToProps = (reduxState, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(SurveyContactsFilter);
export const SEARCH_SURVEY_CONTACTS_FILTER_SCREEN =
  'nav/SEARCH_SURVEY_CONTACTS_FILTER';
