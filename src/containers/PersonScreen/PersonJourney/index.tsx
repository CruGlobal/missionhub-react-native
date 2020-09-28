import React, { useEffect, useContext } from 'react';
import { View, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';

import JourneyCommentBox from '../../../components/JourneyCommentBox';
import { navigatePush } from '../../../actions/navigation';
import { getJourney } from '../../../actions/journey';
import { Flex, Separator } from '../../../components/common';
import JourneyItem from '../../../components/JourneyItem';
import PopupMenu from '../../../components/PopupMenu';
import NULL from '../../../../assets/images/ourJourney.png';
import NullStateComponent from '../../../components/NullStateComponent';
import { JOURNEY_EDIT_FLOW } from '../../../routes/constants';
import {
  ACCEPTED_STEP,
  EDIT_JOURNEY_STEP,
  EDIT_JOURNEY_ITEM,
} from '../../../constants';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { RootState } from '../../../reducers';
import { personSelector } from '../../../selectors/people';
import { useMyId } from '../../../utils/hooks/useIsMe';
import { CollapsibleViewContext } from '../../../components/CollapsibleView/CollapsibleView';

import styles from './styles';

interface PersonJourneyProps {
  collapsibleHeaderContext: CollapsibleViewContext;
}

export const PersonJourney = ({
  collapsibleHeaderContext,
}: PersonJourneyProps) => {
  const { t } = useTranslation('contactJourney');
  const dispatch = useDispatch();
  const myId = useMyId();

  const personId: string = useNavigationParam('personId');

  const person = useSelector(
    (state: RootState) =>
      personSelector(state, { personId }) || {
        id: personId,
      },
  );

  const journeyItems = useSelector(
    ({ journey }: RootState) => journey['personal'][personId] || undefined,
  );
  useAnalytics(['person', person.id === myId ? 'my journey' : 'our journey'], {
    assignmentType: { personId },
  });

  useEffect(() => {
    dispatch(getJourney(person.id));
  }, []);

  const handleEditInteraction = (interaction: {
    _type: string;
    id: string;
    note: string;
    comment: string;
  }) => {
    const isStep = interaction._type === ACCEPTED_STEP;

    dispatch(
      navigatePush(JOURNEY_EDIT_FLOW, {
        id: interaction.id,
        type: isStep ? EDIT_JOURNEY_STEP : EDIT_JOURNEY_ITEM,
        initialText: isStep ? interaction.note : interaction.comment,
        personId: person.id,
      }),
    );
  };

  // @ts-ignore
  const renderRow = ({ item }) => {
    const content = (
      <JourneyItem
        // @ts-ignore
        item={item}
        myId={myId}
        personFirstName={person.first_name}
      />
    );

    if (
      item._type !== 'answer_sheet' &&
      item._type !== 'pathway_progression_audit'
    ) {
      return (
        <PopupMenu
          key={item.id}
          actions={[
            { text: t('edit'), onPress: () => handleEditInteraction(item) },
          ]}
          buttonProps={{
            style: { flex: 1 },
          }}
          triggerOnLongPress={true}
        >
          {content}
        </PopupMenu>
      );
    }
    return content;
  };

  const keyExtractor = (item: { id: string; _type: string }) =>
    `${item.id}-${item._type}`;
  const itemSeparator = (sectionID: unknown, rowID: string) => (
    <Separator key={rowID} />
  );

  const renderNull = () => (
    <NullStateComponent
      imageSource={NULL}
      headerText={t('ourJourney').toUpperCase()}
      descriptionText={t('journeyNull')}
      style={styles.nullState}
    />
  );

  const { collapsibleScrollViewProps } = useContext(collapsibleHeaderContext);

  return (
    <View style={styles.container}>
      <Animated.FlatList
        {...collapsibleScrollViewProps}
        style={styles.list}
        data={journeyItems}
        keyExtractor={keyExtractor}
        renderItem={renderRow}
        ItemSeparatorComponent={itemSeparator}
        ListEmptyComponent={renderNull}
      />
      <Flex justify="end">
        <JourneyCommentBox person={person} />
      </Flex>
    </View>
  );
};

export const PERSON_JOURNEY = 'nav/PERSON_JOURNEY';
