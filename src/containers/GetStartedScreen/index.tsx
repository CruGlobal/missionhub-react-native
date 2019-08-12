import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';

import { Flex, Text } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import { disableBack } from '../../utils/common';
import { ProfileState } from '../../reducers/profile';

import styles from './styles';

const GetStartedScreen = ({
  dispatch,
  next,
  id,
  name,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: (props: { id: string | null }) => ThunkAction<void, any, null, never>;
  id: string | null;
  name: string;
}) => {
  useEffect(() => {
    disableBack.add();
    return () => disableBack.remove();
  }, []);

  const { t } = useTranslation('getStarted');

  const navigateNext = () => {
    disableBack.remove();

    dispatch(next({ id }));
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
      </Flex>
    </SafeAreaView>
  );
};

const mapStateToProps = ({ profile }: { profile: ProfileState }) => {
  const id = profile.id || '';
  const name = (profile.firstName || '').toLowerCase();

  return {
    id,
    name,
  };
};

export default connect(mapStateToProps)(GetStartedScreen);
export const GET_STARTED_SCREEN = 'nav/GET_STARTED';
