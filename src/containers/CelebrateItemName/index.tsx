import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux-legacy';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { Button } from '../../components/common';
import ItemHeaderText from '../../components/ItemHeaderText/index';
import { navToPersonScreen } from '../../actions/person';
import { GetCelebrateFeed_community_celebrationItems_nodes_subjectPerson } from '../CelebrateFeed/__generated__/GetCelebrateFeed';
import { Organization } from '../../reducers/organizations';
import { Person } from '../../reducers/people';

import styles from './styles';

export interface CelebrateItemNameProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  name: string | null;
  person:
    | GetCelebrateFeed_community_celebrationItems_nodes_subjectPerson
    | Person
    | null;
  organization: Organization;
  pressable: boolean;
  customContent?: JSX.Element;
}

const CelebrateItemName = ({
  dispatch,
  name,
  person,
  organization,
  pressable,
  customContent,
}: CelebrateItemNameProps) => {
  const { t } = useTranslation('celebrateFeeds');

  const onPressNameLink = () =>
    person && dispatch(navToPersonScreen(person, organization));

  const content = customContent || (
    <ItemHeaderText
      text={name || t('missionHubUser')}
      style={styles.nameText}
    />
  );

  if (!name || !pressable) {
    return content;
  }

  return (
    <Button testID="NameButton" type="transparent" onPress={onPressNameLink}>
      {content}
    </Button>
  );
};

export default connect()(CelebrateItemName);
