import React from 'react';
import { Switch } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Flex, Text, Touchable, Icon } from '../common';
import theme from '../../theme';

import styles from './styles';

type FilterItemType = {
  id?: string;
  text?: string;
  preview?: string;
};

interface FilterItemProps {
  item: FilterItemType;
  onSelect: (item: FilterItemType) => void;
  type: 'drilldown' | 'single' | 'switch';
  isSelected?: boolean;
  testID?: string;
}

const FilterItem = ({ item, onSelect, type, isSelected }: FilterItemProps) => {
  const { t } = useTranslation('searchFilterRefine');

  const handleSelect = () => {
    onSelect(item);
  };

  const renderRight = () => {
    if (type === 'drilldown') {
      return (
        <Flex direction="row" align="center">
          <Text style={styles.anyText} numberOfLines={1}>
            {item.preview || t('any')}
          </Text>
          <Icon
            name="rightArrowIcon"
            type="MissionHub"
            style={styles.anyIcon}
          />
        </Flex>
      );
    }
    if (type === 'switch') {
      return (
        <Switch
          onValueChange={handleSelect}
          value={isSelected}
          trackColor={{ true: theme.primaryColor, false: '' }}
        />
      );
    }
    if (type === 'single' && isSelected) {
      return (
        <Icon name="checkIcon" type="MissionHub" style={styles.checkIcon} />
      );
    }
    return null;
  };

  const content = (
    <Flex
      direction="row"
      align="center"
      style={[styles.row, type === 'switch' ? styles.switchRow : null]}
    >
      <Text style={styles.name}>{item.text}</Text>
      {renderRight()}
    </Flex>
  );

  if (type === 'drilldown' || type === 'single') {
    return (
      <Touchable highlight={true} onPress={handleSelect}>
        {content}
      </Touchable>
    );
  }
  return content;
};

export default FilterItem;
