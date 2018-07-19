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

import styles from './styles';

@translate('searchFilter')
export class SearchQuestionsFilterScreen extends Component {
  constructor(props) {
    super(props);
    const { filters, options } = props;

    this.state = {
      filters,
      options,
      selectedFilter: {},
      refreshing: false,
    };
  }

  componentWillMount() {
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
        title: this.props.t('titleAnswers'),
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
    this.setState({ selectedFilter: item });

    this.props.dispatch(trackSearchFilter(item.id));
  };

  handleSelectFilter = item => {
    const { options, selectedFilter } = this.state;
    const newOptions = options.map(o => ({
      ...o,
      preview: o.id === selectedFilter.id ? item.text : null,
    }));
    let newFilters = {
      id: selectedFilter.id,
      answer: item,
    };
    if (item.id === 'any') {
      newFilters = {};
    }
    this.setState({ options: newOptions });
    this.setFilter(newFilters);
  };

  render() {
    const { t } = this.props;
    const { options } = this.state;
    return (
      <View style={styles.pageContainer}>
        <Header left={<BackButton />} title={t('titleQuestions')} />
        <ScrollView style={{ flex: 1 }}>
          {options.map(o => (
            <FilterItem
              key={o.id}
              item={o}
              onSelect={this.handleDrillDown}
              type="drilldown"
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}

SearchQuestionsFilterScreen.propTypes = {
  onFilter: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  filters: PropTypes.object.isRequired,
};

const mapStateToProps = (reduxState, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(SearchQuestionsFilterScreen);
export const SEARCH_QUESTIONS_FILTER_SCREEN = 'nav/SEARCH_QUESTIONS_FILTER';
