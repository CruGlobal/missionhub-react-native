/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCommunities
// ====================================================

export interface GetCommunities_globalCommunity_usersReport {
  __typename: 'UsersReport';
  usersCount: number;
}

export interface GetCommunities_globalCommunity {
  __typename: 'GlobalCommunity';
  /**
   * Get a report on the number of people using MissionHub
   */
  usersReport: GetCommunities_globalCommunity_usersReport;
}

export interface GetCommunities_communities_nodes_people_nodes {
  __typename: 'Person';
  id: string;
  firstName: string;
  lastName: string;
}

export interface GetCommunities_communities_nodes_people {
  __typename: 'PersonConnection';
  /**
   * A list of nodes.
   */
  nodes: GetCommunities_communities_nodes_people_nodes[];
}

export interface GetCommunities_communities_nodes_report {
  __typename: 'CommunitiesReport';
  /**
   * Total number of contacts (non-members) in this community and all child communities.
   */
  contactCount: number;
  /**
   * Total number of users, admins, and owners (non-contacts) in this community and all child communities.
   */
  memberCount: number;
  /**
   * Total number of unassigned people in this community and all child communities.
   */
  unassignedCount: number;
}

export interface GetCommunities_communities_nodes {
  __typename: 'Community';
  id: string;
  name: string;
  unreadCommentsCount: number;
  userCreated: boolean;
  communityPhotoUrl: string | null;
  /**
   * Get a list of people
   */
  people: GetCommunities_communities_nodes_people;
  /**
   * Get a report of interactions, contact statuses, and contact stages in communities
   */
  report: GetCommunities_communities_nodes_report;
}

export interface GetCommunities_communities {
  __typename: 'CommunityConnection';
  /**
   * A list of nodes.
   */
  nodes: GetCommunities_communities_nodes[];
}

export interface GetCommunities {
  globalCommunity: GetCommunities_globalCommunity;
  /**
   * Get a list of communities
   */
  communities: GetCommunities_communities;
}
