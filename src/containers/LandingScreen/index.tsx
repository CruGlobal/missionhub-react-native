import { ThunkDispatch } from 'redux-thunk';
import { SafeAreaView, Image, View } from 'react-native';

import LOGO from '../../../assets/images/missionHubLogoWords.png';
import { Button, Text } from '../../components/common';

import styles from './styles';

const LandingScreen = ({
  dispatch,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, any>;
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View alignItems="center" justifyContent="end" style={styles.imageWrap}>
        <Image source={LOGO} />
      </View>
      <View
        flex={1}
        alignItems="center"
        justifyContent="center"
        alignSelf="stretch"
        style={styles.buttonWrapper}
      >
        <View
          flew={2}
          flexDirection="column"
          justifyContent="center"
          alignSelf="stretch"
          alignItems="center"
        >
          <Button
            name={'tryItNowButton'}
            pill={true}
            onPress={this.tryItNow}
            text={t('getStarted').toUpperCase()}
            style={styles.button}
            buttonTextStyle={styles.buttonText}
          />
          <Button
            name={'communityCodeButton'}
            pill={true}
            onPress={this.communityCode}
            text={t('haveCode').toUpperCase()}
            style={styles.button}
            buttonTextStyle={styles.buttonText}
          />
        </View>
        <View alignItems="end" flexDirection="row">
          <Text style={styles.memberText}>{t('member').toUpperCase()}</Text>
          <Button
            name={'signInButton'}
            text={t('signIn').toUpperCase()}
            type="transparent"
            onPress={this.signIn}
            buttonTextStyle={[styles.buttonText, styles.signInBtnText]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default connect()(LandingScreen);
