import React from 'react';
import { View, Modal, Text, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@apollo/react-hooks';
import DeviceInfo from 'react-native-device-info';
import gql from 'graphql-tag';

import { Button, Flex } from '../../components/common';
import IconButton from '../IconButton';
import { trackAction as analyticsTrackAction } from '../../actions/analytics';

import styles from './styles';
import {
  GetAnnouncement,
  GetAnnouncementVariables,
  GetAnnouncement_announcement_actions_nodes,
} from './__generated__/GetAnnouncement';
import {
  markAnnouncementAsRead,
  markAnnouncementAsReadVariables,
} from './__generated__/markAnnouncementAsRead';

export const GET_ANNOUNCEMENT = gql`
  query GetAnnouncement($version: String) {
    announcement(version: $version) {
      id
      body
      title
      actions {
        nodes {
          id
          label
          trackAction
          uri
        }
      }
    }
  }
`;

export const HANDLE_ANNOUNCEMENT = gql`
  mutation markAnnouncementAsRead($input: MarkAnnouncementAsReadInput!) {
    markAnnouncementAsRead(input: $input) {
      success
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
  const currentAppVersion = DeviceInfo.getVersion();
  const { data: { announcement = null } = {}, loading } = useQuery<
    GetAnnouncement,
    GetAnnouncementVariables
  >(GET_ANNOUNCEMENT, { variables: { version: currentAppVersion } });
  const [handleAnnouncementAction] = useMutation<
    markAnnouncementAsRead,
    markAnnouncementAsReadVariables
  >(HANDLE_ANNOUNCEMENT, {
    refetchQueries: [{ query: GET_ANNOUNCEMENT }],
  });

  const completeAnnouncementAction = async (
    announcementId: string,
    announcementAction?: GetAnnouncement_announcement_actions_nodes,
  ) => {
    const { id, trackAction, uri } = announcementAction || {};
    await handleAnnouncementAction({
      variables: {
        input: {
          announcementId,
          announcementActionId: id ? id : null,
        },
      },
    });

    uri && Linking.openURL(uri);
    trackAction && analyticsTrackAction(trackAction, {});
  };

  if (loading || !announcement) {
    return null;
  }

  const { title, body, id, actions } = announcement;

  return (
    <Modal transparent animationType={'slide'} visible={true}>
      <View style={modalStyle}>
        <View style={containerStyle}>
          <Flex direction="row" justify="end" style={{ width: '100%' }}>
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
