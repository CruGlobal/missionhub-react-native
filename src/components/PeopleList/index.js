import React, { Component } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';

import PeopleItem from '../PeopleItem';
import styles from './styles';

export default class PeopleList extends Component {
  
  render() {
    const { items, onSelect, myId } = this.props;
    // if (sections) {
    //   let formattedItems = items.reduce((p, n) => {
    //     const orgId = n.organization_id;
    //     if (p[orgId]) {
    //       p[orgId].data.push(n);
    //     } else {
    //       p[orgId] = { key: orgId, data: [n] };
    //     }
    //   }, {});
    //   formattedItems = Object.keys(formattedItems).map((key) => formattedItems[key]);
    //   return (
    //     <SectionList
    //       style={styles.list}
    //       sections={formattedItems}
    //       keyExtractor={(i) => i.id}
    //       renderItem={({ item }) => (
    //         <PeopleItem
    //           onSelect={onSelect}
    //           person={item} />
    //       )}
    //       renderSectionHeader={({ item }) => (
    //         <PeopleItem
    //           onSelect={onSelect}
    //           person={item} />
    //       )}
    //     />
    //   );
    // }
    return (
      <FlatList
        style={styles.list}
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <PeopleItem
            isMe={item.id === myId}
            onSelect={onSelect}
            person={item} />
        )}
      />
    );
  }

}

PeopleList.propTypes = {
  sections: PropTypes.bool,
  items: PropTypes.array.isRequired,
  myId: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};
