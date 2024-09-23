import FuseAnimate from "@fuse/core/FuseAnimate";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { Icon, Typography } from "@material-ui/core";
import React from "react";

function privacyPolicy() {
  return (
    <FusePageSimple
      // classes={{
      //   // contentWrapper: "p-0 sm:p-24 pb-80 sm:pb-80 h-full",
      //   header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
      // }}
      // header={
      //   <div className="flex flex-1 items-center justify-between p-8 sm:p-24">
      //     <div className="flex flex-shrink items-center sm:w-224">
      //       <div className="flex items-center">
      //         <FuseAnimate animation="transition.expandIn" delay={300}>
      //           <Icon className="text-32 mr-12">message</Icon>
      //         </FuseAnimate>
      //         <FuseAnimate animation="transition.slideLeftIn" delay={300}>
      //           <Typography variant="h6" className="sm:flex">
      //             Privacy Policy
      //           </Typography>
      //         </FuseAnimate>
      //       </div>
      //     </div>
      //   </div>
      // }
      content={
        <>
          <div className="p-10">
          <Typography variant="h5"  style={{'font-size': '2.0rem', 'font-weight': '600', 'paddingBottom': '20px'}}> Privacy Policy</Typography>
            <FuseAnimate animation="transition.expandIn" delay={300}>
            <div className="flex-col relative overflow-hidden px-8">
              <Typography  variant="h5">Introduction</Typography>
            <div>
            <div className="flex flex-col gap-10 mt-10">
              <Typography  color="textPrimary">
                [Ediquo Technolgies Pvt Ltd/ QBuild] (“we” or “us” or “our”) respects the privacy of our users (“user” or “you”). 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website qbuild.app including any other media form, media channel, mobile website, or mobile application related or connected thereto (collectively, the “Site”).
                Please read this privacy policy carefully.  If you do not agree with the terms of this privacy policy, please do not access the site.
              </Typography>

              <Typography  color="textPrimary">
                We reserve the right to make changes to this Privacy Policy at any time and for any reason.
                We will alert you about any changes only by updating the “Last Updated” date of this Privacy Policy.
                Any changes or modifications will be effective immediately upon posting the updated Privacy Policy on the Site, and you waive the right to receive specific notice of each such change or modification.  
              </Typography>

              <Typography  color="textPrimary">
                You are encouraged to periodically review this Privacy Policy to stay informed of updates.
                You will be deemed to have been made aware of, will be subject to, 
                and will be deemed to have accepted the changes in any revised Privacy Policy by your continued use of the Site after the date such revised Privacy Policy is posted.
              </Typography>

            </div>
        </div>
            </div>
            </FuseAnimate>

            <FuseAnimate animation="transition.expandIn" delay={300}>
            <div className="flex-col relative overflow-hidden px-8 mt-20">
              <Typography  variant="h5">Collection of your information</Typography>
            <div>
            <div className="flex flex-col gap-10 mt-10">
              <Typography  color="textPrimary">
                We may collect information about you in a variety of ways. 
                The information we may collect on the Site includes:
              </Typography>
              <FuseAnimate animation="transition.expandIn" delay={300}>
                  <>
            <div className="flex-col relative overflow-hidden px-8">
              <Typography  variant="h6">Personal Data</Typography>
             <div>
                <div className="flex flex-col gap-10 mt-10">
                <Typography  color="textPrimary">
                Personally identifiable information, such as your name, email address, and telephone number, 
                that you voluntarily give to us when you register with the App
                </Typography>
              </div>
            </div>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography  variant="h6">Derivative Data</Typography>
             <div>
                <div className="flex flex-col gap-10 mt-10">
                <Typography  color="textPrimary">
                Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times.
                [If you are using our application on mobile, this information may also include your device name and type, your operating system, your phone number, your country, as well as any other information you choose to provide.]
                </Typography>
              </div>
            </div>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography  variant="h6">Financial Data</Typography>
             <div>
                <div className="flex flex-col gap-10 mt-10">
                <Typography  color="textPrimary">
                Financial information, such as data related to your payment method (e.g. valid credit card number, card brand, expiration date) that we may collect when you do payment information about our services from the App. We store only very limited, if any, financial information that we collect.
                Otherwise, all financial information is stored by our payment processor(s), and you are encouraged to review their privacy policy and contact them directly for responses to your questions.]
                </Typography>
              </div>
            </div>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography  variant="h6">Data From Social Networks</Typography>
             <div>
                <div className="flex flex-col gap-10 mt-10">
                <Typography  color="textPrimary">
                User information from social networking sites, such as [Google+], including your name, your social network username, location, gender, birth date, email address, profile picture, and public data for contacts, if you connect your account to such social networks. 
                [If you are using our application on mobile, this information may also include the contact information of anyone you invite to use and/or join our application.]
                </Typography>
              </div>
            </div>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography  variant="h6">Mobile Device Data</Typography>
             <div>
                <div className="flex flex-col gap-10 mt-10">
                <Typography  color="textPrimary">
                Device information, such as your mobile model, and manufacturer, and information about the location of your device, if you access the Site from a mobile device.
                </Typography>
              </div>
            </div>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography  variant="h6">Third-Party Data</Typography>
              <div>
                <div className="flex flex-col gap-10 mt-10">
                <Typography  color="textPrimary">
                  Information from third parties, such as personal information or network friends, if you connect your account to the third party and  grant the Site permission to access this information.
                </Typography>
              </div>
            </div>
            </div>
            </>
            </FuseAnimate>
            </div>
        </div>
            </div>
            </FuseAnimate>

            <FuseAnimate animation="transition.expandIn" delay={300}>
            <div className="flex-col relative overflow-hidden px-8 mt-20">
              <Typography  variant="h5">Application Access On Mobile Device</Typography>
            <div>
            <div className="flex flex-col gap-10 mt-10">
              <Typography  color="textPrimary">
                If you connect using our Application on Mobile Device:
              </Typography>
              <FuseAnimate animation="transition.expandIn" delay={300}>
                  <>
            <div className="flex-col relative overflow-hidden px-8">
              <Typography  variant="h6">Geo-Location Information</Typography>
             <div>
                <div className="flex flex-col gap-10 mt-10">
                <Typography  color="textPrimary">
                We may request access or permission to and track location-based information from your mobile device, either continuously or while you are using our mobile application, to provide location-based services.
                If you wish to change our access or permissions, you may do so in your device’s settings.
                </Typography>
              </div>
            </div>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography  variant="h6">Mobile Device Access</Typography>
             <div>
                <div className="flex flex-col gap-10 mt-10">
                <Typography  color="textPrimary">
                We may request access or permission to certain features from your mobile device. If you wish to change our access or permissions, you may do so in your device’s settings.
                </Typography>
              </div>
            </div>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography  variant="h6">Mobile Device Data</Typography>
             <div>
                <div className="flex flex-col gap-10 mt-10">
                <Typography  color="textPrimary">
                  We may collect device information (such as your mobile model and manufacturer), operating system, version information and IP address.
                </Typography>
              </div>
            </div>
            </div>

            </>
            </FuseAnimate>
            </div>
        </div>
            </div>
            </FuseAnimate>

            <FuseAnimate animation="transition.expandIn" delay={300}>
            <div className="flex-col relative overflow-hidden px-8 mt-20">
              <Typography  variant="h5">Use of your Information</Typography>
            <div>
            <div className="flex flex-col gap-10 mt-10">
              <Typography  color="textPrimary">
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. 
              Specifically, we may use information collected about you via the Site or Application to:
              </Typography>
              <FuseAnimate animation="transition.expandIn" delay={300}>
                  <>
            <div className="flex-col relative overflow-hidden px-8">
              <Typography>Assist law enforcement and respond to subpoena.</Typography>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography>Compile anonymous statistical data and analysis for use internally or with third parties.</Typography>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography>Create and manage your account.</Typography>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography>Email you regarding your account.</Typography>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography>Increase the efficiency and operation of the Site and Application.</Typography>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography>Monitor and analyze usage and trends to improve your experience with the Site and Application.</Typography>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography>Perform other business activities as needed.</Typography>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</Typography>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography>Process payments and refunds.</Typography>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography>Resolve disputes and troubleshoot problems.</Typography>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography>Solicit support for the Site and Application.</Typography>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography>[Other]</Typography>
            </div>

            </>
            </FuseAnimate>
            </div>
        </div>
            </div>
            </FuseAnimate>

            <FuseAnimate animation="transition.expandIn" delay={300}>
            <div className="flex-col relative overflow-hidden px-8 mt-20">
              <Typography  variant="h5">Disclosure of your information</Typography>
            <div>
            <div className="flex flex-col gap-10 mt-10">
              <Typography  color="textPrimary">
              We may share information we have collected about you in certain situations. Your information may be disclosed as follows: 
              </Typography>
              <FuseAnimate animation="transition.expandIn" delay={300}>
                  <>
            <div className="flex-col relative overflow-hidden px-8">
              <Typography  variant="h6">By Law or to Protect Rights -</Typography>
             <div>
                <div className="flex flex-col gap-10 mt-10">
                <Typography  color="textPrimary">
                If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.  
                This includes exchanging information with other entities for fraud protection and credit risk reduction.
                </Typography>
              </div>
            </div>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography  variant="h6">Third-Party Service Providers -</Typography>
             <div>
                <div className="flex flex-col gap-10 mt-10">
                <Typography  color="textPrimary">
                  We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance. 
                </Typography>
              </div>
            </div>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography  variant="h6">Interactions with Other Users -</Typography>
             <div>
                <div className="flex flex-col gap-10 mt-10">
                <Typography  color="textPrimary">
                If you interact with other users of the Application, those users may see your name, profile photo, and descriptions of your activity.
                </Typography>
              </div>
            </div>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography  variant="h6">Business Partners -</Typography>
             <div>
                <div className="flex flex-col gap-10 mt-10">
                <Typography  color="textPrimary">
                  We may share your information with our business partners to offer you certain products, services or promotions.
                </Typography>
              </div>
            </div>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography  variant="h6">Social Media Contacts -</Typography>
             <div>
                <div className="flex flex-col gap-10 mt-10">
                <Typography  color="textPrimary">
                If you connect to the Application through a social network, your contacts on the social network will see your name, profile photo, and descriptions of your activity.
                </Typography>
              </div>
            </div>
            </div>

            <div className="flex-col relative overflow-hidden px-8">
              <Typography  variant="h6">Other Third Parties -</Typography>
             <div>
                <div className="flex flex-col gap-10 mt-10">
                <Typography  color="textPrimary">
                We may share your information with advertisers and investors for the purpose of conducting general business analysis. 
                We may also share your information with such third parties for marketing purposes, as permitted by law.
                </Typography>
              </div>
            </div>
            </div>


            </>
            </FuseAnimate>
            </div>
        </div>
            </div>
            </FuseAnimate>

            <FuseAnimate animation="transition.expandIn" delay={300}>
            <div className="flex-col relative overflow-hidden px-8 mt-20">
              <Typography  variant="h5">Tracking Technologies</Typography>
            <div>
            <div className="flex flex-col gap-10 mt-10">
              
              <FuseAnimate animation="transition.expandIn" delay={300}>
                  <>
            <div className="flex-col relative overflow-hidden px-8">
              <Typography  variant="h6">Cookies</Typography>
             <div>
                <div className="flex flex-col gap-10 mt-10">
                <Typography  color="textPrimary">
                [We may use cookies, and other tracking technologies on the Site [and our mobile application] to help customize the Site [and our mobile application] and improve your experience. When you access the Site [or our mobile application], your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site  [or our mobile application]. You may not decline web beacons. However, they can be rendered ineffective by declining all cookies or by modifying your web browser’s settings to notify you each time a cookie is tendered, permitting you to accept or decline cookies on an individual basis.]
                </Typography>
              </div>
            </div>
            </div>

            </>
            </FuseAnimate>
            </div>
        </div>
            </div>
            </FuseAnimate>


            <FuseAnimate animation="transition.expandIn" delay={300}>
            <div className="flex-col relative overflow-hidden px-8 mt-20">
              <Typography  variant="h5">Security of your information</Typography>
            <div>
            <div className="flex flex-col gap-10 mt-10">
              <Typography  color="textPrimary">
              We use administrative, technical, and physical security measures to help protect your personal information.  While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.  Any information disclosed online is vulnerable to interception and misuse by unauthorized parties.
              Therefore, we cannot guarantee complete security if you provide personal information.
              </Typography>  
            </div>
           </div>
            </div>
            </FuseAnimate>

            <FuseAnimate animation="transition.expandIn" delay={300}>
             <div className="flex-col relative overflow-hidden px-8 mt-20">
               <Typography  variant="h5">Policy for Children</Typography>
              <div>
               <div className="flex flex-col gap-10 mt-10">
                <Typography  color="textPrimary">
                  We do not knowingly solicit information from or market to children under the age of 13.
                  If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.
                </Typography>  
               </div>
             </div>
            </div>
            </FuseAnimate>

          
            <FuseAnimate animation="transition.expandIn" delay={300}>
            <div className="flex-col relative overflow-hidden px-8 mt-20">
              <Typography  variant="h5">Option regarding your information</Typography>
            <div>
            <div className="flex flex-col gap-10 mt-10">
              
              <FuseAnimate animation="transition.expandIn" delay={300}>
                  <>
            <div className="flex-col relative overflow-hidden px-8">
              <Typography  variant="h6">Account Information</Typography>
             <div>
                <div className="flex flex-col gap-10 mt-10">
                <Typography  color="textPrimary">
                You may at any time review or change the information in your account or terminate your account by:</Typography>
                <Typography  color="textPrimary">Logging into your account settings and updating your account</Typography>
                <Typography  color="textPrimary"> Contacting us using the contact information provided below</Typography>
                <Typography  color="textPrimary"> [Other]</Typography>
                <Typography  color="textPrimary"> Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, some information may be retained in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Use and/or comply with legal requirements.]
                </Typography>
              </div>
            </div>
            </div>
            </>
            </FuseAnimate>
            </div>
        </div>
            </div>
            </FuseAnimate>


            <FuseAnimate animation="transition.expandIn" delay={300}>
             <div className="flex-col relative overflow-hidden px-8 mt-20">
               <Typography  variant="h5">Emails and Communications</Typography>
              <div>
               <div className="flex flex-col gap-10 mt-10">
                <Typography  color="textPrimary">
                  If you no longer wish to receive correspondence, emails, or other communications from us, you may opt-out by Contacting us using the contact information provided below.
                </Typography>  
               </div>
             </div>
            </div>
            </FuseAnimate>
            
            <FuseAnimate animation="transition.expandIn" delay={300}>
             <div className="flex-col relative overflow-hidden px-8 mt-20">
               <Typography  variant="h5">Contact Us</Typography>
              <div>
               <div className="flex flex-col gap-10 mt-10">
                <Typography  color="textPrimary">If you have questions or comments about this Privacy Policy, please contact us at:</Typography> 
                <Typography  color="textPrimary">Ediquo Technologies Pvt Ltd, Narayanashram,17th Road, Chembur Mumbai India 400071</Typography> 
                <Typography  color="textPrimary">Last updated [Nov 08, 2021]</Typography> 
                 
               </div>
             </div>
            </div>
            </FuseAnimate>
            
          </div>
        </>
      }
    />
  );
}

export default privacyPolicy;
