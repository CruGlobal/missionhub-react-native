import React from 'react';
import { ScrollView, View } from 'react-native';

import Header from '../Header';
import BackButton from '../../containers/BackButton';
import FilterItem from '../FilterItem';

import styles from './styles';

type FilterItem = object;

interface FilterListProps {
  onDrillDown: (item: FilterItem) => void;
  onToggle: (item: FilterItem) => void;
  title?: string;
  options?: {
    id?: string;
    text?: string;
    drilldown?: object[];
  }[];
  toggleOptions?: {
    id?: string;
    selected?: boolean;
  }[];
}

const FilterList = ({
  title,
  options,
  onDrillDown,
  onToggle,
  toggleOptions,
}: FilterListProps) => {
  const handleDrillDown = (item: object) => {
    onDrillDown(item);
  };
  const handleToggle = (item: object) => {
    onToggle(item);
  };
  return (
    <View style={styles.pageContainer}>
      <Header left={<BackButton />} title={title} />
      <ScrollView style={styles.list}>
        {options &&
          options.map((o, i) => (
            <FilterItem
              key={o.id}
              item={o}
              testID={`FilterListOption${i}`}
              onSelect={handleDrillDown}
              type="drilldown"
            />
          ))}
        {toggleOptions &&
          toggleOptions.map((o, i) => (
            <FilterItem
              key={o.id}
              item={o}
              testID={`FilterListToggleOption${i}`}
              onSelect={handleToggle}
              type="switch"
              isSelected={o.selected}
            />
          ))}
      </ScrollView>
    </View>
  );
};

export default FilterList;
