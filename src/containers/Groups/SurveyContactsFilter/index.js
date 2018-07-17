import React, { Component } from 'react';
import { View, ScrollView, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { navigatePush } from '../../../actions/navigation';
import { getSurveyQuestions } from '../../../actions/surveys';
import Header from '../../Header';
import FilterItem from '../../../components/FilterItem';
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

import { SEARCH_QUESTIONS_FILTER_SCREEN } from './SurveyQuestionsFilterScreen';
import styles from './styles';

@translate('searchFilter')
export class SurveyContactsFilter extends Component {
  constructor(props) {
    super(props);
    const { t, filters } = props;

    const filterOptions = getFilterOptions(t, filters, []);
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
    const { t, dispatch, survey } = this.props;
    const questions = await dispatch(getSurveyQuestions(survey.id));
    this.createFilters(questions);
  }

  createFilters(questions) {
    const { t, filters } = this.props;
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
    this.setState({ filters, options, toggleOptions });
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
      navigatePush(
        item.id === 'questions'
          ? SEARCH_QUESTIONS_FILTER_SCREEN
          : SEARCH_REFINE_SCREEN,
        {
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
        },
      ),
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
