import React from "react";
import { Redirect } from "react-router-dom";
import FuseUtils from "@fuse/utils";
import UsersConfig from "app/main/users/UsersConfig";
import AccountsConfig from "app/main/accounts/AccountsConfig";
import privacyPolicyConfig from "app/main/privacy-policy/privacyPolicyConfig";
import refundPolicyConfig from "app/main/refundPolicy/refundPolicyConfig";
import termsConfig from "app/main/terms/termsConfig";
import { NotificationConfig } from "app/main/notifications/NotificationConfig";
import ProjectsConfig from "app/main/projects/ProjectsConfig";
import ResetPasswordConfig from "app/main/reset-password/ResetPasswordConfig";
import { DashboardConfig } from "app/main/projects/dashbords/DashboardConfig";
import { LoginConfig } from "app/main/login/LoginConfig";
import RegisterConfig from "app/main/register/RegisterConfig";
import { ForgotPasswordConfig } from "app/main/forgot-password/ForgotPasswordConfig";
import { NewProjectConfig } from "app/main/projects/new-project/newProjectConfig";
import { RegistartionResponseConfig } from "app/main/registration-response/RegistrationResponseConfig";
import { InviteConfig } from "app/main/invite/InviteConfig";
import { ContactUsConfig } from "app/main/contact-us/ContactUsConfig";
import { StructuralAuditConfig } from "app/main/projects/project-details/components/report/structural-audit/StructuralAuditConfig";
import PlanViewConfig from "app/main/projects/plan-view/PlanViewConfig";
import { PlanSummaryConfig } from "app/main/projects/project-details/components/report/plan-summary/PlanSummaryConfig";
import { PaymentConfig } from "app/main/payment/PaymentConfig";
import { ReportConfig } from "app/main/summary/ReportConfig";
import { DataConfig } from "app/main/dataStructure/DataConfig";
import { VendorsConfig } from "app/main/vendors/VendorsConfig";
import { OrganizationConfig } from "app/main/organization/OrganizationConfig";
import { SiteConfig } from "app/main/organization/organization-details/sites/SitesConfig";
import { OnBoardingConfig } from "app/main/onBoarding/OnBoardingConfig";
import { VerifyUserConfig } from "app/main/verify-user/VerifyUserConfig";

const routeConfigs = [
  VerifyUserConfig,
  DashboardConfig,
  LoginConfig,
  RegisterConfig,
  ForgotPasswordConfig,
  ResetPasswordConfig,
  NewProjectConfig,
  PlanViewConfig,
  StructuralAuditConfig,
  PlanSummaryConfig,
  ProjectsConfig,
  RegistartionResponseConfig,
  NotificationConfig,
  UsersConfig,
  AccountsConfig,
  privacyPolicyConfig,
  refundPolicyConfig,
  termsConfig,
  InviteConfig,
  PaymentConfig,
  ContactUsConfig,
  VendorsConfig,
  OrganizationConfig,
  SiteConfig,
  ReportConfig,
  DataConfig,
  OnBoardingConfig
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs),
  {
    path: "/",
    component: () => <Redirect to="/projects" />,
  },
];

export default routes;
