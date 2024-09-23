import axios from 'axios';
import constants from 'app/main/config/constants';
//import _ from '@lodash';

class AdminService { 
     async monthlySignups() {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/users/signups/monthly`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
     }
    
      async projectsType() {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}//projects/stats/type`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}

const instance = new AdminService();
export default instance;
