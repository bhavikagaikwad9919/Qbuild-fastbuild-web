import { authRoles } from "app/auth";
const navigationConfig = [
  // {
  //   id: "dashboard-component",
  //   title: "Dashboard",
  //   type: "item",
  //   icon: "dashboard",
  //   url: "/dashboard",
  //   auth: authRoles.project,
  // },
  
  {
    id: "projects-component",
    title: "Projects",
    type: "item",
    icon: "whatshot",
    url: "/projects",
  },
  {
    id: "organization-component",
    title: "Organizations",
    type: "item",
    icon: "bussinesIcon",
    url: "/Organization",
  },
  {
    id: "notification",
    title: "Notifications",
    type: "item",
    icon: "notifications",
    badge: {
      title: 0,
      bg: "#525E8A",
      fg: "#FFFFFF",
    },
    url: "/notification",
    auth: authRoles.project,
  },
  {
    id: "users-component",
    title: "Users",
    type: "item",
    icon: "person",
    url: "/users",
    auth: authRoles.admin,
  },
  // {
  //   id: "invite-component",
  //   title: "Invite",
  //   type: "item",
  //   icon: "person_add",
  //   url: "/invite",
  // },
  {
    id: "vendors-component",
    title: "Vendors",
    type: "item",
    icon: "person",
    url: "/vendors",
  },
  //  {
  //   id: "payment-component",
  //   title: "Payment",
  //   type: "item",
  //   icon: "money",
  //   url: "/payment",
  // },
  // {
  //   id: "contactUs-component",
  //   title: "Contact Us",
  //   type: "item",
  //   icon: "message",
  //   url: "/contact-us",
  // },
];

export default navigationConfig;
