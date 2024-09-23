import axios from "axios";
import constants from "app/main/config/constants";
//import _ from "@lodash";

class NotificationService {
  async getNotification(userId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/notifications/${userId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getNotificationForAdmin(userId, page, limit, text) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/notifications/admin/notify?page=${page}&limit=${limit}&text=${text}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async deleteNotifications(ids) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/notifications/delete/admin/notify`,
        {
          notificationIds: ids,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addNotifications(data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/notifications/add`,
        {
          data: data,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async readNotification(notificationId) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/notifications/${notificationId}/read`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async unreadCount(userId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/notifications/${userId}/unread`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getInvoiceNotifications(userId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/notifications/${userId}/invoice`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}

const instance = new NotificationService();
export default instance;
