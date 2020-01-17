import React, { Component } from 'react';
import { connect } from 'react-redux-legacy';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { navigatePush } from '../../../actions/navigation';
import FilterList from '../../../components/FilterList';
import { buildTrackingObj, isString } from '../../../utils/common';
import { SEARCH_REFINE_SCREEN } from '../../SearchPeopleFilterRefineScreen';
import { trackSearchFilter } from '../../../actions/analytics';

// @ts-ignore
@withTranslation('searchFilter')
export class SurveyQuestionsFilter extends Component {
  // @ts-ignore
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

  // @ts-ignore
  handleDrillDown = item => {
    // @ts-ignore
    const { dispatch, t } = this.props;
    const { id, options } = item;
    // @ts-ignore
    const { filters } = this.state;
    // Pull the options from the props that were not loaded when this was initialized
    dispatch(
      navigatePush(SEARCH_REFINE_SCREEN, {
        onFilter: this.handleSelectFilter,
        title: t('titleAnswers'),
        // @ts-ignore
        options: (isString(options) && this.props[options]) || options,
        filters: (filters.answers && filters.answers[id]) || {},
        // @ts-ignore
        trackingObj: buildTrackingObj(
          `search : refine : ${id}`,
          'search',
          'refine',
          id,
        ),
      }),
    );
    this.setState({ selectedFilterId: id });

    // @ts-ignore
    this.props.dispatch(trackSearchFilter(id));
  };

  // @ts-ignore
  handleSelectFilter = item => {
    // @ts-ignore
    const { options, selectedFilterId, filters } = this.state;
    // @ts-ignore
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
    // @ts-ignore
    this.props.onFilter(newFilters);
  };

  render() {
    // @ts-ignore
    const { t } = this.props;
    // @ts-ignore
    const { options } = this.state;
    return (
      // @ts-ignore
      <FilterList
        onDrillDown={this.handleDrillDown}
        options={options}
        title={t('titleQuestions')}
      />
    );
  }
}

// @ts-ignore
SurveyQuestionsFilter.propTypes = {
  onFilter: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  filters: PropTypes.object.isRequired,
};

// @ts-ignore
const mapStateToProps = (reduxState, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(SurveyQuestionsFilter);
export const SEARCH_QUESTIONS_FILTER_SCREEN = 'nav/SEARCH_QUESTIONS_FILTER';
