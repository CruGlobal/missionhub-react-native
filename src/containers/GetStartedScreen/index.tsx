import React from 'react';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';

import { Flex, Text } from '../../components/common';
import BackButton from '../BackButton';
import BottomButton from '../../components/BottomButton';
import { useDisableBack } from '../../utils/hooks/useDisableBack';
import { ProfileState } from '../../reducers/profile';

import styles from './styles';

interface GetStartedScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: () => ThunkAction<void, any, null, never>;
  name: string;
  enableBackButton: boolean;
}

const GetStartedScreen = ({
  dispatch,
  next,
  name,
  enableBackButton = true,
}: GetStartedScreenProps) => {
  const enableBack = useDisableBack(enableBackButton);

  const { t } = useTranslation('getStarted');

  const navigateNext = () => {
    enableBack();

    dispatch(next());
  };

  return (
    <SafeAreaView style={styles.container}>
      <Flex align="center" justify="center" value={1} style={styles.content}>
        <Flex align="start" justify="center" value={4}>
          <Text header={true} style={styles.headerTitle}>
            {t('hi', { name })}
          </Text>
          <Text style={styles.text}>{t('tagline')}</Text>
        </Flex>
        <BottomButton onPress={navigateNext} text={t('getStarted')} />
        {enableBackButton ? <BackButton absolute={true} /> : null}
      </Flex>
    </SafeAreaView>
  );
};

const mapStateToProps = (
  { profile }: { profile: ProfileState },
  {
    navigation: {
      state: {
        params: { enableBackButton },
      },
    },
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
) => {
  const name = (profile.firstName || '').toLowerCase();

  return {
    name,
    enableBackButton,
  };
};

export default connect(mapStateToProps)(GetStartedScreen);
export const GET_STARTED_SCREEN = 'nav/GET_STARTED';
