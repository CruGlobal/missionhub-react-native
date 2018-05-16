import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, TouchableWithoutFeedback } from 'react-native';
import { translate } from 'react-i18next';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import i18next from '../../i18n';
import { Text, Button, Flex } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import theme from '../../theme';
import LANDSCAPE from '../../../assets/images/landscapeOnboardingImage.png';
import { KEY_LOGIN_SCREEN } from '../KeyLoginScreen';
import { trackState } from '../../actions/analytics';
import { buildTrackingObj } from '../../utils/common';
import { LOGIN_OPTIONS_SCREEN } from '../LoginOptionsScreen';
import { LOGIN_TAB_CHANGED } from '../../constants';

import styles from './styles';

const overScrollMargin = 120;

const sliderWidth = theme.fullWidth;

const ONBOARDING = [
  {
    id: 1,
    name: i18next.t('onboarding:screen1.name'),
  },
  {
    id: 2,
    name: i18next.t('onboarding:screen2.name'),
  },
  {
    id: 3,
    name: i18next.t('onboarding:screen3.name'),
  },
];

@translate('login')
class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSlide: 0,
      scrollPosition: 0,
      autoPlay: true,
    };

    this.renderOnboarding = this.renderOnboarding.bind(this);
    this.getStarted = this.getStarted.bind(this);
    this.login = this.login.bind(this);
    this.handleSnapToItem = this.handleSnapToItem.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.disableAutoPlay = this.disableAutoPlay.bind(this);
  }

  componentDidMount() {
    this.trackSplashState(1);
  }

  login() {
    this.navigateToNext(KEY_LOGIN_SCREEN);
  }

  getStarted() {
    this.navigateToNext(LOGIN_OPTIONS_SCREEN);
  }

  navigateToNext(nextScreen) {
    this.props.dispatch(navigatePush(nextScreen));
  }

  handleSnapToItem(index) {
    this.setState({ activeSlide: index });

    this.trackSplashState(index + 1);

    if (index === ONBOARDING.length - 1) { this.disableAutoPlay(); }
  }

  trackSplashState(index) {
    const { dispatch } = this.props;
    const trackingObj = buildTrackingObj(`splash : ${index}`, 'splash');

    dispatch({ type: LOGIN_TAB_CHANGED, newActiveTab: trackingObj });
    dispatch(trackState(trackingObj));
  }

  handleScroll(e) {
    this.setState({ scrollPosition: e.nativeEvent.contentOffset.x });
  }

  disableAutoPlay() {
    this.setState({ autoPlay: false });
  }

  renderOnboarding({ item }) {
    return (
      <View key={item.id} style={styles.onboardWrap}>
        <TouchableWithoutFeedback onPressIn={this.disableAutoPlay}>
          <Flex direction="column">
            <Flex value={1.5} justify="center">
              <Text type="header" style={styles.onboardHeader}>{item.name.toLowerCase()}</Text>
            </Flex>
            <Flex value={1} />
          </Flex>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    const { t } = this.props;

    let leftMargin = (this.state.scrollPosition / -1) - overScrollMargin;

    return (
      <Flex style={styles.container}>
        <Flex value={3} align="center" justify="center">
          <Flex value={4} align="center">
            <Pagination
              dotsLength={3}
              activeDotIndex={this.state.activeSlide}
              containerStyle={{ marginTop: 15 }}
              dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 0,
                backgroundColor: theme.primaryColor,
              }}
              inactiveDotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 0,
                backgroundColor: theme.secondaryColor,
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.8}
            />
            <Carousel
              data={ONBOARDING}
              inactiveSlideOpacity={1}
              inactiveSlideScale={1}
              renderItem={this.renderOnboarding}
              sliderWidth={sliderWidth}
              itemWidth={sliderWidth}
              scrollEventThrottle={5}
              onSnapToItem={this.handleSnapToItem}
              onScroll={this.handleScroll}
              autoplay={this.state.autoPlay}
              autoplayDelay={0}
              autoplayInterval={3000}
            />
            <Image
              source={LANDSCAPE}
              style={[
                styles.footerImage,
                { left: leftMargin },
              ]}
            />
          </Flex>
          <Flex value={1} align="center" justify="start" self="stretch" style={styles.buttonWrapper}>
            <Flex direction="column" self="stretch" align="center">
              <Button
                pill={true}
                text={t('getStarted').toUpperCase()}
                onPress={this.getStarted}
                style={styles.getStarted}
                buttonTextStyle={styles.buttonText}
              />
              <Flex direction="row" align="center">
                <Text style={styles.signInText}>{t('member').toUpperCase()}</Text>
                <Button
                  text={t('signIn').toUpperCase()}
                  type="transparent"
                  onPress={this.login}
                  style={styles.signInButton}
                  buttonTextStyle={styles.signInBtnText}
                />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

export default connect()(LoginScreen);
export const LOGIN_SCREEN = 'nav/LOGIN';
