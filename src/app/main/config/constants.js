// require('dotenv').config();
import { config } from "dotenv";
config();
const devConfig = {
  BASE_URL: "https://api.qbuild.app",
  // BASE_URL: "https://api-staging.qbuild.app",
  
  // BASE_URL: "http://localhost:5000",
  GOOGLE_CRED: "1055526564506-hort8tpjmo824irs61ngu03v3hseqjon.apps.googleusercontent.com",
  // "334514908718-vb6ilrv8lkcu9d4qsjgo0nmubuk32bq9.apps.googleusercontent.com",
  FB_APP_ID: "2678917582383430",
  MAP_KEY: "AIzaSyAvSSB5cGqXE74uSDcz0WEssC3Eoktr0Bo",
};

export default devConfig;
