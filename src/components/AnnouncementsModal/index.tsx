import React from 'react';
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
  GetAnnouncements_announcements_nodes_actions_nodes,
} from './__generated__/GetAnnouncements';
import { handleAnnouncement } from './__generated__/handleAnnouncement';

export const GET_ANNOUNCEMENTS = gql`
  query GetAnnouncements {
    announcements(first: 1) {
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
  mutation HandleAnnouncement($input: CreatePersonAnnouncementInput!) {
    createPersonAnnouncement(input: $input) {
      personAnnouncement {
        announcement {
          id
        }
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
  const { t } = useTranslation();
  const {
    data: { announcements: { nodes: [announcement] = [] } = {} } = {},
    loading,
  } = useQuery<GetAnnouncements>(GET_ANNOUNCEMENTS);
  const [handleAnnouncementAction] = useMutation<handleAnnouncement>(
    HANDLE_ANNOUNCEMENTS,
    {
      refetchQueries: [{ query: GET_ANNOUNCEMENTS }],
    },
  );

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
          return trackAction(args, {});
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
  };

  if (loading || !announcement) {
    return null;
  }

  const isModalVisible = () => {
    if (!loading && announcement) {
      return true;
    } else {
      return false;
    }
  };

  const { title, body, id, actions } = announcement;

  return (
    <Modal transparent animationType={'slide'} visible={isModalVisible()}>
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
            actions.nodes.map(action => {
              return (
                <Button
                  testID={'AnnouncementActionButton'}
                  key={action.id}
                  pill={true}
                  style={modalButton}
                  text={
                    action.label ? action.label.toUpperCase() : t('continue')
                  }
                  onPress={() => completeAnnouncementAction(id, action)}
                />
              );
            })
          ) : (
            <Button
              testID={'AnnouncementNoActionButton'}
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
