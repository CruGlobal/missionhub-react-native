import { AuthPerson_currentUser_person } from './__generated__/AuthPerson';

export enum IdentityProvider {
  Apple,
  Google,
  Facebook,
  TheKey,
  Anonymous,
}

export enum AuthError {
  None,
  CredentialsIncorrect,
  EmailUnverified,
  MfaRequired,
  MfaIncorrect,
  Unknown,
}

export const emptyAuthPerson: AuthPerson_currentUser_person = {
  __typename: 'Person' as const,
  id: '',
  firstName: '',
  lastName: '',
  fullName: '',
  stage: null,
  globalRegistryMdmId: null,
  fbUid: null,
  theKeyUid: null,
};
