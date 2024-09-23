import axios from "axios";
import constants from "app/main/config/constants";
//import _ from "@lodash";

class OrganizationService {

  async addOrganization(form, userId) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/organization/add/${userId}`,
          {
            orgData : {
              "name":form.name,
              "address":form.address,
              "contact":form.contact,
              "gstIn":form.gstIn,
              "cIn": form.cIn,
              "pan": form.pan,
              "tan": form.tan,
              "from": form.from
            }
          },
      );
        return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getOrganizationsForAdmin() {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/organization/list/All/org`
      );
        return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getOrganizations(userId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/organization/list/${userId}`
      );
        return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getOrganization(OrganizationId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/organization/${OrganizationId}`
      );
        return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateOrganization(form, organizationId) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/organization/update/${organizationId}`, form
      );
        return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateDataStructure(id, form,) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/organization/dataStructure/${id}`,
          {
            orgData : form
          },
      );
        return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateSiteDataStructure(organizationId, siteId, form,) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/organization/${organizationId}/site/${siteId}/dataStructure`,
          {
            orgData : form
          },
      );
        return response.data;
    } catch (e) {
      throw e;
    }
  }

  async listMember(id) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/organization/${id}/member`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addMember(id, member) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/organization/${id}/member/add`,
        {
          name: member.name,
          email: member.email,
          contact: member.contact,
          designation: member.designation,
          access: member.access,
          code: member.code
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async deleteMember(organizationId, memberId) {
    try {
      const response = await axios.delete(
        `${constants.BASE_URL}/organization/${organizationId}/member/${memberId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async verifyMember(userId, code) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/organization/member/${userId}/verify/${code}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }


  async updateMember(organizationId, memberId, member) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/organization/${organizationId}/member/${memberId}/update`,
        {
          name: member.name,
          contact: member.contact,
          designation: member.designation,
          access: member.access
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async listSite(id) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/organization/${id}/site`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getSite(id, siteId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/organization/${id}/site/${siteId}`
      );
        return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addSite(id, site) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/organization/${id}/site/add`,
        {
          name: site.name,
          address: site.address,
          reraNo: site.reraNo,
          ctsNo: site.ctsNo
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async deleteSite(organizationId, siteId) {
    try {
      const response = await axios.delete(
        `${constants.BASE_URL}/organization/${organizationId}/site/${siteId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateSite(organizationId, siteId, site) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/organization/${organizationId}/site/${siteId}/update`,
        site
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }


  async downloadEquipmentExcelReport(organizationId, siteId, userId, siteName, filters) {
    let response = "";
    response = await axios.get(
      `${constants.BASE_URL}/organization/${organizationId}/site/${siteId}/equipment/report/download?siteName=${siteName}&userId=${userId}&startDate=${filters.startDate}&endDate=${filters.endDate}`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async downloadConsumptionExcelReport(organizationId, siteId, userId, siteName, filters) {
    let response = "";
    response = await axios.get(
      `${constants.BASE_URL}/organization/${organizationId}/site/${siteId}/consumption/report/download?siteName=${siteName}&userId=${userId}&startDate=${filters.startDate}&endDate=${filters.endDate}`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async getAgencies(organizationIdId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/vendors/organization/list/${organizationIdId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async detailAgency(vendorId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/vendors/${vendorId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addAgency(organizationId, form) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/vendors/organization/add/${organizationId}`,
        form
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }
  
  async updateAgency(vendorId, form) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/vendors/${vendorId}`,
        form
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

}

const instance = new OrganizationService();
export default instance;
