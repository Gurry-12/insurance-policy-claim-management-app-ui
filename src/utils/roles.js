export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  AGENT: 'ROLE_AGENT',
  CUSTOMER: 'ROLE_CUSTOMER',
};

export const ROLE_HOME = {
  [ROLES.ADMIN]: '/dashboard',
  [ROLES.AGENT]: '/dashboard',
  [ROLES.CUSTOMER]: '/dashboard',
};