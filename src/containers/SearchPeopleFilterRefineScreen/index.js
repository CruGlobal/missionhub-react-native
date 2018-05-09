import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { navigatePush } from '../../actions/navigation';
import Header from '../Header';
import FilterItem from '../../components/FilterItem';
import { trackSearchFilter } from '../../actions/analytics';
import { buildTrackingObj } from '../../utils/common';
import BackButton from '../BackButton';

import styles from './styles';

function setSelected(items = [], id) {
  return items.map((i) => ({
    ...i,
    selected: i.id === id,
    preview: undefined,
  }));
}

@translate('searchFilterRefine')
export class SearchPeopleFilterRefineScreen extends Component {

  constructor(props) {
    super(props);
    const t = props.t;
    let options = [].concat(props.options);
    const hasSelected = !!options.find((o) => o && o.selected);
    if (!options[0] || options[0].id !== 'any') {
      options.unshift({ id: 'any', text: t('any'), selected: !hasSelected });
    }

    this.state = {
      options,
      selectedDrillDownId: '',
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleFilterSelect = this.handleFilterSelect.bind(this);
  }

  handleSelect(item) {
    if (item.drilldown) {
      this.setState({ selectedDrillDownId: item.id });
      this.props.dispatch(navigatePush(SEARCH_REFINE_SCREEN, {
        onFilter: this.handleFilterSelect,
        options: item.drilldown,
        trackingObj: buildTrackingObj(`search : refine : ${item.id}`, 'search', 'refine', item.id),
      }));

      this.props.dispatch(trackSearchFilter(item.id));

    } else {
      const newOptions = setSelected(this.state.options, item.id);
      this.setState({ options: newOptions });
      this.props.onFilter(item);
    }
  }

  handleFilterSelect(item) {
    const option = this.state.options.find((o) => o.id === this.state.selectedDrillDownId);
    const newOptions = this.state.options.map((o) => ({
      ...o,
      selected: o.id === option.id,
      preview: item.text,
    }));
    this.setState({ options: newOptions });
    this.props.onFilter(item);
  }

  render() {
    const { t, title } = this.props;
    return (
      <View style={styles.pageContainer}>
        <Header
          left={
            <BackButton />
          }
          title={title || t('title')}
        />
        <FlatList
          style={styles.list}
          data={this.state.options}
          keyExtractor={(i) => i.id}
          initialNumToRender={15}
          renderItem={({ item }) => (
            <FilterItem
              item={item}
              onSelect={this.handleSelect}
              type={item.drilldown ? 'drilldown' : 'single'}
              isSelected={item.selected}
            />
          )}
        />
      </View>
    );
  }
}

SearchPeopleFilterRefineScreen.propTypes = {
  onFilter: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    text: PropTypes.string,
    drilldown: PropTypes.array,
  })).isRequired,
  title: PropTypes.string,
};

const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(SearchPeopleFilterRefineScreen);
export const SEARCH_REFINE_SCREEN = 'nav/SEARCH_FILTER_REFINE';
