import { useAuthPerson } from '../../auth/authHooks';

export const useMyId = () => {
  const authPerson = useAuthPerson();
  return authPerson.id;
};

export const useIsMe = (personId: string | undefined) => {
  const authPersonId = useMyId();
  return personId === authPersonId;
};
