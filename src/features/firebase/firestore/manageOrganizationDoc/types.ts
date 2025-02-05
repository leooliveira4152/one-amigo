export type FirestoreOrganization = {
  id: string;
  name: string;
  members: string[];
  roles: string[];
  pirateCrew?: boolean;
};
