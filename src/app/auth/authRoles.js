/**
 * Authorization Roles
 */
const authRoles = {
  admin: ["admin"],
  staff: ["admin", "staff"],
  project: [
    "admin",
    "ho",
    "so",
    "HO",
    "SO",
    "owner",
    "siteincharge",
    "siteIncharge",
    "projectmanager",
    "projectManager",
  ],
  onlyGuest: [],
};

export default authRoles;
