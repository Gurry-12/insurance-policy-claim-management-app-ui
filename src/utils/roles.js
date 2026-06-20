export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  AGENT: 'ROLE_AGENT',
  CUSTOMER: 'ROLE_CUSTOMER',
};

export const ROLE_HOME = {
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.AGENT]: '/agent/dashboard',
  [ROLES.CUSTOMER]: '/customer/dashboard',
};