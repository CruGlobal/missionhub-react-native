import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { navigatePush } from '../../../actions/navigation';
import FilterList from '../../../components/FilterList';
import { buildTrackingObj, isString } from '../../../utils/common';
import { SEARCH_REFINE_SCREEN } from '../../SearchPeopleFilterRefineScreen';
import { trackSearchFilter } from '../../../actions/analytics';

@translate('searchFilter')
export class SurveyQuestionsFilter extends Component {
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
    const { dispatch, t } = this.props;
    const { id, options } = item;
    const { filters } = this.state;
    // Pull the options from the props that were not loaded when this was initialized
    dispatch(
      navigatePush(SEARCH_REFINE_SCREEN, {
        onFilter: this.handleSelectFilter,
        title: t('titleAnswers'),
        options: (isString(options) && this.props[options]) || options,
        filters: (filters.answers && filters.answers[id]) || {},
        trackingObj: buildTrackingObj(
          `search : refine : ${id}`,
          'search',
          'refine',
          id,
        ),
      }),
    );
    this.setState({ selectedFilterId: id });

    this.props.dispatch(trackSearchFilter(id));
  };

  handleSelectFilter = item => {
    const { options, selectedFilterId, filters } = this.state;
    const newOptions = options.map(o => ({
      ...o,
      preview: o.id === selectedFilterId ? item.text : o.preview,
    }));
    const newFilters = {
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

SurveyQuestionsFilter.propTypes = {
  onFilter: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  filters: PropTypes.object.isRequired,
};

const mapStateToProps = (reduxState, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(SurveyQuestionsFilter);
export const SEARCH_QUESTIONS_FILTER_SCREEN = 'nav/SEARCH_QUESTIONS_FILTER';
