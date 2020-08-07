import React from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux-legacy';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import NoStage from '../../../assets/images/noStage.svg';
import ItemHeaderText from '../../components/ItemHeaderText';
import { Text, Touchable, Icon, Card } from '../../components/common';
import {
  navigateToStageScreen,
  navigateToAddStepFlow,
} from '../../actions/misc';
import { navToPersonScreen } from '../../actions/person';
import { Organization } from '../../reducers/organizations';
import { AuthState } from '../../reducers/auth';
import { StagesState } from '../../reducers/stages';
import { RootState } from '../../reducers';
import { contactAssignmentSelector } from '../../selectors/people';
import { useIsMe } from '../../utils/hooks/useIsMe';

import styles from './styles';
import { PersonFragment } from './__generated__/PersonFragment';

interface PersonItemProps {
  person: PersonFragment;
  organization?: Organization;
}

const PersonItem = ({ person, organization }: PersonItemProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    id,
    fullName,
    stage,
    steps: {
      pageInfo: { totalCount },
    },
  } = person;

  const isMe = useIsMe(id);

  const contactAssignment =
    useSelector(({ auth }: RootState) =>
      contactAssignmentSelector({ auth }, { person }),
    ) || {};

  const personName = isMe ? t('me') : fullName;

  const handleSelect = () => dispatch(navToPersonScreen(id));

  const handleChangeStage = () =>
    dispatch(
      navigateToStageScreen(
        isMe,
        person,
        contactAssignment,
        organization,
        stage?.position && stage.position - 1,
        true,
      ),
    );

  const handleAddStep = () =>
    stage
      ? dispatch(navigateToAddStepFlow(isMe, person, organization))
      : handleChangeStage();

  const renderStageIcon = () => {
    return (
      <View style={styles.stageIconWrapper}>
        {stage && stage.iconUrl ? (
          <Image
            style={styles.image}
            resizeMode={'contain'}
            source={{ uri: stage.iconUrl }}
          />
        ) : (
          <NoStage />
        )}
      </View>
    );
  };

  const renderNameAndStage = () => {
    return (
      <View style={styles.textWrapper}>
        <ItemHeaderText text={personName} />
        <View style={styles.textRow}>
          {stage ? (
            <Text style={styles.stage}>{stage.nameI18n}</Text>
          ) : (
            <Touchable testID="stageText" onPress={handleChangeStage}>
              <Text style={[styles.stage, styles.addStage]}>
                {t('peopleScreen:addStage')}
              </Text>
            </Touchable>
          )}
        </View>
      </View>
    );
  };

  const renderStepIcon = () => {
    return totalCount > 0 ? (
      <View style={styles.stepButtonWrapper}>
        <Icon
          type="MissionHub"
          name="stepsIcon"
          size={30}
          style={styles.stepIcon}
        />
        <View style={styles.badge} testID="stepsCount">
          <Text style={styles.badgeText}>{totalCount}</Text>
        </View>
      </View>
    ) : (
      <Touchable
        testID="stepIcon"
        style={styles.stepButtonWrapper}
        onPress={handleAddStep}
      >
        <Icon
          type="MissionHub"
          name="stepsIcon"
          size={30}
          style={styles.stepIcon}
        />
        <Icon
          type="MissionHub"
          name="plusIcon"
          size={14}
          style={styles.stepPlusIcon}
        />
      </Touchable>
    );
  };

  return (
    <Card testID="personCard" onPress={handleSelect} style={styles.card}>
      {renderStageIcon()}
      {renderNameAndStage()}
      {renderStepIcon()}
    </Card>
  );
};

const mapStateToProps = ({
  auth,
  stages,
}: {
  auth: AuthState;
  stages: StagesState;
}) => ({
  me: auth.person,
  stagesObj: stages.stagesObj || {},
});

export default connect(mapStateToProps)(PersonItem);
