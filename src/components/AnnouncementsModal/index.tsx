import React, { useState, useEffect } from 'react';
import { View, Modal, Text, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Button, Flex } from '../../components/common';
import IconButton from '../IconButton';
import { trackAction } from '../../actions/analytics';

import styles from './styles';
import {
  GetAnnouncements,
  GetAnnouncements_announcements_nodes,
  GetAnnouncements_announcements_nodes_actions_nodes,
} from './__generated__/GetAnnouncements';
import { handleAnnouncement } from './__generated__/handleAnnouncement';

export const GET_ANNOUNCEMENTS = gql`
  query GetAnnouncements {
    announcements(first: 5) {
      nodes {
        body
        id
        title
        actions {
          nodes {
            id
            label
            action
            args
          }
        }
      }
    }
  }
`;

export const HANDLE_ANNOUNCEMENTS = gql`
  mutation handleAnnouncement($input: CreatePersonAnnouncementInput!) {
    createPersonAnnouncement(input: $input) {
      personAnnouncement {
        announcement {
          body
          title
          active
        }
        person {
          fullName
        }
        id
      }
    }
  }
`;

const AnnouncementsModal = () => {
  const {
    modalStyle,
    containerStyle,
    modalButton,
    closeButton,
    titleText,
    bodyText,
  } = styles;
  const { t } = useTranslation('common');
  const {
    data: { announcements, announcements: { nodes = [] } = {} } = {},
    refetch,
    loading,
  } = useQuery<GetAnnouncements>(GET_ANNOUNCEMENTS);
  const [handleAnnouncementAction] = useMutation<handleAnnouncement>(
    HANDLE_ANNOUNCEMENTS,
  );
  const [announcement, setAnnouncements] = useState<
    GetAnnouncements_announcements_nodes
  >();
  const [modalVisibility, changeModalVisbility] = useState(true);

  const completeAnnouncementAction = async (
    announcementId: string,
    announcementAction?: GetAnnouncements_announcements_nodes_actions_nodes,
  ) => {
    if (announcementAction) {
      const { id, action, args } = announcementAction;
      await handleAnnouncementAction({
        variables: {
          input: {
            announcementId,
            announcementActionId: id,
          },
        },
      });
      switch (action) {
        case 'go':
          Linking.openURL(args);
          break;
        case 'track':
          changeModalVisbility(false);
          refetch();
          return trackAction(args, {});
        default:
          break;
      }
    } else {
      await handleAnnouncementAction({
        variables: {
          input: {
            announcementId,
          },
        },
      });
    }

    changeModalVisbility(false);
    refetch();
  };

  useEffect(() => {
    if (announcements && announcements.nodes) {
      setAnnouncements(announcements.nodes[0]);
      if (announcement) {
        changeModalVisbility(true);
      }
    }
  }, [announcements, announcement, nodes]);

  if (loading || !announcement) {
    return null;
  }

  const { title, body, id, actions } = announcement;

  return (
    <Modal transparent animationType={'slide'} visible={modalVisibility}>
      <View style={modalStyle}>
        <View style={containerStyle}>
          <Flex
            direction="row"
            justify="end"
            style={{ width: '100%', marginTop: -60 }}
          >
            <IconButton
              testID="CloseButton"
              style={closeButton}
              onPress={() => completeAnnouncementAction(id)}
              name="close"
              type="Material"
              size={32}
            />
          </Flex>
          <Text style={titleText}>{title}</Text>
          <Text style={bodyText}>{body}</Text>

          {actions.nodes.length >= 1 ? (
            actions.nodes.map(
              (action: GetAnnouncements_announcements_nodes_actions_nodes) => {
                return (
                  <Button
                    testID={'CompleteAnnouncementActionButton'}
                    key={action.id}
                    pill={true}
                    style={modalButton}
                    text={
                      action.label ? action.label.toUpperCase() : t('continue')
                    }
                    onPress={() => completeAnnouncementAction(id, action)}
                  />
                );
              },
            )
          ) : (
            <Button
              pill={true}
              style={modalButton}
              text={t('done')}
              onPress={() => completeAnnouncementAction(id)}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};
export default AnnouncementsModal;
