import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image } from 'react-native';
import { getStages } from '../../actions/stages';

import Carousel from 'react-native-snap-carousel';
import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import LANDSCAPE from '../../../assets/images/landscape.png';
import UNINTERESTED from '../../../assets/images/uninterestedIcon.png';
import CURIOUS from '../../../assets/images/curiousIcon.png';
import FORGIVEN from '../../../assets/images/forgivenIcon.png';
import GROWING from '../../../assets/images/growingIcon.png';
import GUIDING from '../../../assets/images/guidingIcon.png';
import PropTypes from 'prop-types';

import theme from '../../theme';

const sliderWidth = theme.fullWidth;
const stageWidth = theme.fullWidth - 120;
const stageMargin = theme.fullWidth / 30;

const stageIcons = [
  UNINTERESTED,
  CURIOUS,
  FORGIVEN,
  GROWING,
  GUIDING,
];

class PathwayStageScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollPosition: 0,
    };

    this.renderStage = this.renderStage.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getStages());
  }

  setStage(stage) {
    this.props.onSelect(stage);
  }

  renderStage({ item, index }) {
    return (
      <View key={item.id} style={styles.cardWrapper}>
        <View style={styles.card}>
          <Image source={stageIcons[index]} />
          <Text type="header" style={styles.cardHeader}>{item.name.toLowerCase()}</Text>
          <Text style={styles.cardText}>{item.description}</Text>
        </View>
        <Button
          type="primary"
          onPress={() => this.setStage(item)}
          text={this.props.buttonText}
        />
      </View>
    );
  }

  handleScroll(e) {
    this.setState({ scrollPosition: e.nativeEvent.contentOffset.x });
  }

  render() {
    let leftMargin;

    if (this.state.scrollPosition < 0) {
      leftMargin = -30;
    } else {
      leftMargin = (this.state.scrollPosition / -1) -30;
    }

    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Image
          resizeMode="contain"
          source={LANDSCAPE}
          style={[
            styles.footerImage,
            { left: leftMargin },
          ]}
        />
        <Flex value={1} align="center" justify="center">
          <Text style={styles.title}>
            {this.props.questionText}
          </Text>
          {
            this.props.stages ? (
              <Carousel
                data={this.props.stages}
                inactiveSlideOpacity={1}
                inactiveSlideScale={1}
                renderItem={this.renderStage}
                sliderWidth={sliderWidth + 75}
                itemWidth={stageWidth + stageMargin * 2}
                onScroll={this.handleScroll}
                scrollEventThrottle={5}
              />
            ) : null
          }
        </Flex>
      </Flex>
    );
  }

}

PathwayStageScreen.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

const mapStateToProps = ({ stages }) => ({
  stages: stages.stages,
});

export default connect(mapStateToProps)(PathwayStageScreen);
