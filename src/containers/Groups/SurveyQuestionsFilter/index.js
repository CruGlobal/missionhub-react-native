import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { navigatePush } from '../../../actions/navigation';
import Header from '../../Header';
import FilterList from '../../../components/FilterList';
import { buildTrackingObj, isString } from '../../../utils/common';
import { SEARCH_REFINE_SCREEN } from '../../SearchPeopleFilterRefineScreen';
import { trackSearchFilter } from '../../../actions/analytics';
import BackButton from '../../BackButton';

import styles from './styles';

@translate('searchFilter')
export class SurveyQuestionsFilterScreen extends Component {
  constructor(props) {
    super(props);
    const { filters, options } = props;

    this.state = {
      filters,
      options,
      selectedFilterId: '',
      refreshing: false,
    };
  }

  handleDrillDown = item => {
    // Pull the options from the props that were not loaded when this was initialized
    const options =
      (isString(item.options) && this.props[item.options]) || item.options;
    this.props.dispatch(
      navigatePush(SEARCH_REFINE_SCREEN, {
        onFilter: this.handleSelectFilter,
        title: this.props.t('titleAnswers'),
        options,
        filters: this.state.filters.answers
          ? this.state.filters.answers[item.id] || {}
          : {},
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

  handleSelectFilter = item => {
    const { options, selectedFilterId, filters } = this.state;
    const newOptions = options.map(o => ({
      ...o,
      preview: o.id === selectedFilterId ? item.text : o.preview,
    }));
    let newFilters = {
      ...filters,
      [selectedFilterId]: {
        id: selectedFilterId,
        text: item.text,
        isAnswer: true,
      },
    };
    if (item.id === 'any') {
      delete newFilters[selectedFilterId];
    }
    this.setState({ options: newOptions, filters: newFilters });
    this.props.onFilter(newFilters);
  };

  render() {
    const { t } = this.props;
    const { options } = this.state;
    return (
      <FilterList
        onDrillDown={this.handleDrillDown}
        options={options}
        title={t('titleQuestions')}
      />
    );
  }
}

SurveyQuestionsFilterScreen.propTypes = {
  onFilter: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  filters: PropTypes.object.isRequired,
};

const mapStateToProps = (reduxState, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(SurveyQuestionsFilterScreen);
export const SEARCH_QUESTIONS_FILTER_SCREEN = 'nav/SEARCH_QUESTIONS_FILTER';
