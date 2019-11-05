interface PersonAttributes {
  id: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  gender: string;
  student_status?: string;
  campus?: string;
  year_in_school?: string;
  major?: string;
  minor?: string;
  birth_date?: string;
  date_became_christian?: string;
  graduation_date?: string;
  picture?: string;
  created_at: string;
  updated_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reverse_contact_assignments: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  organizational_permissions: any[];
}
