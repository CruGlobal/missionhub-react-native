import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux-legacy';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { navigatePush } from '../../actions/navigation';
import Header from '../../components/Header';
import FilterItem from '../../components/FilterItem';
import { trackSearchFilter } from '../../actions/analytics';
import { buildTrackingObj, keyExtractorId } from '../../utils/common';
import BackButton from '../BackButton';

import styles from './styles';

// @ts-ignore
function setSelected(items = [], id) {
  return items.map(i => ({
    // @ts-ignore
    ...i,
    selected: i.id === id,
    preview: undefined,
  }));
}

// @ts-ignore
@withTranslation('searchFilterRefine')
export class SearchPeopleFilterRefineScreen extends Component {
  // @ts-ignore
  constructor(props) {
    super(props);
    const t = props.t;
    const options = [].concat(props.options);
    // @ts-ignore
    const hasSelected = !!options.find(o => o && o.selected);
    // @ts-ignore
    if (!options[0] || options[0].id !== 'any') {
      // @ts-ignore
      options.unshift({ id: 'any', text: t('any'), selected: !hasSelected });
    }

    this.state = {
      options,
      selectedDrillDownId: '',
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleFilterSelect = this.handleFilterSelect.bind(this);
  }

  // @ts-ignore
  handleSelect(item) {
    if (item.drilldown) {
      this.setState({ selectedDrillDownId: item.id });
      // @ts-ignore
      this.props.dispatch(
        navigatePush(SEARCH_REFINE_SCREEN, {
          onFilter: this.handleFilterSelect,
          options: item.drilldown,
          // @ts-ignore
          trackingObj: buildTrackingObj(
            `search : refine : ${item.id}`,
            'search',
            'refine',
            item.id,
          ),
        }),
      );

      // @ts-ignore
      this.props.dispatch(trackSearchFilter(item.id));
    } else {
      // @ts-ignore
      const newOptions = setSelected(this.state.options, item.id);
      this.setState({ options: newOptions });
      // @ts-ignore
      this.props.onFilter(item);
    }
  }

  // @ts-ignore
  handleFilterSelect(item) {
    // @ts-ignore
    const option = this.state.options.find(
      // @ts-ignore
      o => o.id === this.state.selectedDrillDownId,
    );
    // @ts-ignore
    const newOptions = this.state.options.map(o => ({
      ...o,
      selected: o.id === option.id,
      preview: item.text,
    }));
    this.setState({ options: newOptions });
    // @ts-ignore
    this.props.onFilter(item);
  }

  // @ts-ignore
  renderItem = ({ item }) => (
    <FilterItem
      item={item}
      onSelect={this.handleSelect}
      type={item.drilldown ? 'drilldown' : 'single'}
      isSelected={item.selected}
    />
  );

  render() {
    // @ts-ignore
    const { t, title } = this.props;
    return (
      <View style={styles.pageContainer}>
        <Header left={<BackButton />} title={title || t('title')} />
        <FlatList
          style={styles.list}
          // @ts-ignore
          data={this.state.options}
          keyExtractor={keyExtractorId}
          initialNumToRender={15}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

// @ts-ignore
SearchPeopleFilterRefineScreen.propTypes = {
  onFilter: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string,
      drilldown: PropTypes.array,
    }),
  ).isRequired,
  title: PropTypes.string,
};

// @ts-ignore
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(SearchPeopleFilterRefineScreen);
export const SEARCH_REFINE_SCREEN = 'nav/SEARCH_FILTER_REFINE';
