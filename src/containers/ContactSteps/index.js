import React, { Component } from 'react';
import { View, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';

import { getMySteps } from '../../actions/steps';

import styles from './styles';
import { Flex, Button, Text } from '../../components/common';
import StepItem from '../../components/StepItem';
import RowSwipeable from '../../components/RowSwipeable';
import NULL from '../../../assets/images/footprints.png';

class ContactSteps extends Component {

  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.renderNull = this.renderNull.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getMySteps());
  }

  componentDidMount() {
  }

  handleRemove() {
    LOG('remove step');
  }

  handleComplete() {
    LOG('complete step');
  }


  renderRow({item}) {
    return (
      <RowSwipeable
        key={item.id}
        onDelete={() => this.handleRemove(item)}
        onComplete={() => this.handleComplete(item)}
      >
        <StepItem step={item} type="listSwipeable" />
      </RowSwipeable>
    );
  }

  renderList() {
    const { steps } = this.props;
    return (
      <FlatList
        ref={(c) => this.list = c}
        style={styles.list}
        data={steps}
        keyExtractor={(i) => i.id}
        renderItem={this.renderRow}
        bounces={true}
        showsVerticalScrollIndicator={false}
        onScroll={this.handleScroll}
        scrollEventThrottle={100}
      />
    );
  }

  renderNull() {
    const name = 'Ben';
    return (
      <Flex align="center" justify="center">
        <Image source={NULL} />
        <Text type="header" style={styles.nullHeader}>STEPS OF FAITH</Text>
        <Text style={styles.nullText}>Your Steps of Faith with {name} appear here.</Text>
      </Flex>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Flex align="center" justify="center" value={1} style={styles.container}>
          {
            this.props.steps.length > 0 ? this.renderList() : this.renderNull()
          }
        </Flex>
        <Flex justify="end">
          <Button
            type="secondary"
            onPress={()=>{}}
            text="ADD A STEP OF FAITH"
          />
        </Flex>
      </View>
    );
  }
}

const mapStateToProps = ({ steps }) => ({
  steps: steps.mine,
});

export default connect(mapStateToProps)(ContactSteps);
