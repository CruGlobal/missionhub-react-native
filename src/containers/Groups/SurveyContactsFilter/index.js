import React, { Component } from 'react';
import { View, ScrollView, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { navigatePush } from '../../../actions/navigation';
import { getSurveyQuestions } from '../../../actions/surveys';
import Header from '../../Header';
import {
  buildTrackingObj,
  isString,
  getFilterOptions,
  searchHandleToggle,
  searchSelectFilter,
} from '../../../utils/common';
import { SEARCH_REFINE_SCREEN } from '../../SearchPeopleFilterRefineScreen';
import { trackSearchFilter } from '../../../actions/analytics';
import BackButton from '../../BackButton';
import FilterList from '../../../components/FilterList';
import { SEARCH_QUESTIONS_FILTER_SCREEN } from '../SurveyQuestionsFilter';

import styles from './styles';

@translate('searchFilter')
export class SurveyContactsFilter extends Component {
  constructor(props) {
    super(props);
    const { t, filters } = props;

    const { options, toggleOptions } = createFilterOptions(t, filters);

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
    this.loadQuestions();
  }

  async loadQuestions() {
    const { dispatch, survey } = this.props;
    const { response: questions } = await dispatch(
      getSurveyQuestions(survey.id),
    );
    this.createFilters(questions);
  }

  createFilters(questions) {
    const { t, filters } = this.props;
    const { options, toggleOptions } = createFilterOptions(
      t,
      filters,
      questions,
    );
    this.setState({ filters, options, toggleOptions });
  }

  handleDrillDown = item => {
    // Pull the options from the props that were not loaded when this was initialized
    const options =
      isString(item.options) && this.props[item.options]
        ? this.props[item.options]
        : item.options;
    this.props.dispatch(
      item.id === 'questions'
        ? navigatePush(SEARCH_QUESTIONS_FILTER_SCREEN, {
            onFilter: this.handleSelectQuestionFilters,
            title: item.text,
            options,
            filters: this.state.filters.questions || {},
            trackingObj: buildTrackingObj(
              `search : refine : ${item.id}`,
              'search',
              'refine',
              item.id,
            ),
          })
        : navigatePush(SEARCH_REFINE_SCREEN, {
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
    searchHandleToggle(this, item);
  };

  handleSelectFilter = item => {
    searchSelectFilter(this, item);
  };

  handleSelectQuestionFilters = item => {
    const { options, selectedFilterId, filters } = this.state;
    const { t } = this.props;
    const itemKeys = Object.keys(item);
    const filterKeys = Object.keys(filters);
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
      if (newFilters[k].isAnswer) {
        delete newFilters[k];
      }
    });
    newFilters = {
      ...newFilters,
      ...item,
    };

    this.setState({ options: newOptions, filters: newFilters });
    this.props.onFilter(newFilters);
  };

  render() {
    const { t } = this.props;
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

const createFilterOptions = (t, filters, questions = []) => {
  const filterOptions = getFilterOptions(t, filters, questions);
  const options = [
    filterOptions.questions,
    filterOptions.gender,
    filterOptions.time,
  ];
  const toggleOptions = [
    filterOptions.uncontacted,
    filterOptions.unassigned,
    filterOptions.archived,
  ];
  return { options, toggleOptions };
};
