import axios from "axios";
import constants from "app/main/config/constants";
import _ from "@lodash";

class ProjectService {
  async getProjects() {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects?categorized=${true}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getAllProjects() {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/list?paginate=${false}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getProject(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addProject(project) {
    try {
      const response = await axios.post(
        constants.BASE_URL + "/projects/create",
        project
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateProjectDetails(projectId, form) {
    try {
      const response = await axios.put(
        constants.BASE_URL + `/projects/${projectId}`,
        form
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async deleteProject(projectId, deleteServer) {
    try {
      const response = await axios.post(
        constants.BASE_URL + `/projects/${projectId}/delete/${deleteServer}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async dashboard(projectId) {
    try {
      const response = await axios.get(
        constants.BASE_URL + `/projects/${projectId}/dashboard`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addBuildingAreas(projectId, form) {
    try {
      const response = await axios.post(
        constants.BASE_URL + `/projects/${projectId}/buildings/add`,
        form
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async deleteBuildingAreas(projectId, form) {
    try {
      const response = await axios.put(
        constants.BASE_URL + `/projects/${projectId}/buildings/remove`,
        form
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async uploadPlan(projectId, payload) {
    try {
      const options = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      const response = await axios.post(
        constants.BASE_URL + `/projects/${projectId}/plans/uploads`,
        payload,
        options
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updatePlan(projectId, planId, data) {
    try {
      const response = await axios.put(
        constants.BASE_URL + `/projects/${projectId}/plans/${planId}/update`,
        data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getPlanDetails(projectId, planId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/plans/${planId}/view`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getTutorial() {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/data/getTutorials`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async assignPlan(projectId, planId, data) {
    try {
      const response = await axios.put(
        constants.BASE_URL + `/projects/${projectId}/plans/${planId}/assign`,
        data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async revisePlan(projectId, planId, payload) {
    try {
      const options = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      const response = await axios.put(
        constants.BASE_URL + `/projects/${projectId}/plans/${planId}/revise`,
        payload,
        options
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async deletePlans(projectId, ids) {
    try {
      const response = await axios.post(
        constants.BASE_URL + `/projects/${projectId}/plans/delete`,
        {
          ids: ids,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async supersedePlan(projectId, id) {
    try {
      const response = await axios.post(
        constants.BASE_URL + `/projects/${projectId}/plans/supersede`,
        {
          id: id,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async pdfToImage(payload) {
    try {
      const options = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      const response = await axios.post(
        constants.BASE_URL + `/utilities/pdftoimage`,
        payload,
        options
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addTeam(id, team) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${id}/team/add`,
        {
          name: team.name,
          email: team.email,
          contact: team.contact,
          role: team.role,
          tab_access: team.tab_access,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async deleteTeam(projectId, memberId) {
    try {
      const response = await axios.delete(
        `${constants.BASE_URL}/projects/${projectId}/team/${memberId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateTeam(projectId, memberId, team) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/projects/${projectId}/team/${memberId}/update`,
        {
          status: team.status,
          tab_access: team.tab_access,
          role: team.role,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addTask(projectId, payload) {
    try {
      const options = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/task/add`,
        payload,
        options
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async editTask(projectId, taskId, payload) {
    try {
      const options = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/update/task/${taskId}`,
        payload,
        options
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async deleteImageTask(projectId, taskId, imageId) {
    try {
      const response = await axios.delete(
        `${constants.BASE_URL}/projects/${projectId}/tasks/${taskId}/picture/${imageId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async listTasks(projectId, filter) {
    try {
      if (_.isEmpty(filter)) {
        const response = await axios.get(
          `${constants.BASE_URL}/projects/${projectId}/tasks`
        );
        return response.data;
      }
      if (filter.limit) {
        if (filter.status) {
          const response = await axios.get(
            `${
              constants.BASE_URL
            }/projects/${projectId}/tasks?incompleted=${true}&limit=${
              filter.limit
            }`
          );
          return response.data;
        } else {
          const response = await axios.get(
            `${constants.BASE_URL}/projects/${projectId}/tasks?limit=${filter.limit}`
          );
          return response.data;
        }
      } else {
        if (filter.status !== "" || filter.assignedTo !== "") {
          if (filter.status !== "" && filter.assignedTo !== "") {
            if (filter.status === "complete") {
              const response = await axios.get(
                `${
                  constants.BASE_URL
                }/projects/${projectId}/tasks?completed=${true}&assignedTo=${
                  filter.assignedTo
                }`
              );
              return response.data;
            }
            if (filter.status === "incomplete") {
              const response = await axios.get(
                `${
                  constants.BASE_URL
                }/projects/${projectId}/tasks?incompleted=${true}&assignedTo=${
                  filter.assignedTo
                }`
              );
              return response.data;
            }
          }
          if (filter.status === "complete") {
            const response = await axios.get(
              `${
                constants.BASE_URL
              }/projects/${projectId}/tasks?completed=${true}`
            );
            return response.data;
          }
          if (filter.status === "incomplete") {
            const response = await axios.get(
              `${
                constants.BASE_URL
              }/projects/${projectId}/tasks?incompleted=${true}`
            );
            return response.data;
          }
          if (filter.assignedTo !== "") {
            const response = await axios.get(
              `${constants.BASE_URL}/projects/${projectId}/tasks?assignedTo=${filter.assignedTo}`
            );
            return response.data;
          }
        }
        const response = await axios.get(
          `${constants.BASE_URL}/projects/${projectId}/tasks`
        );
        return response.data;
      }
    } catch (e) {
      throw e;
    }
  }

  async taskDetails(projectId, taskId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/task/${taskId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async resolveIssue(projectId, taskId, status, completion) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/task/${taskId}/${status}/${completion}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async deleteTasks(projectId, values) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/tasks/delete`,
        {
          taskIds: values,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async listInventories(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/inventory`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getInventory(projectId, inventoryId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/inventory/${inventoryId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addInventory(projectId, type, unit, brand, supplier, threshold) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/inventory/add`,
        {
          type,
          unit,
          brand,
          supplier,
          threshold,
        }
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateDetailInventory(projectId, inventoryId, form) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/projects/${projectId}/inventory/update/${inventoryId}`,
        form
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateInventory(projectId, inventoryId, type, values) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/projects/${projectId}/inventory/${inventoryId}`,
        {
          transactionType: type,
          quantity: Number(values.quantity),
          description: values.description,
          supplier: values.supplier,
          brand: values.brand,
          transactionDate: values.transactionDate,
          challan_no: values.challan_no,
          grade: values.grade,
          rate: values.rate,
          amount: values.amount,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async exportInventory(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/inventory/export`
      );
      return response;
    } catch (e) {
      throw e;
    }
  }

  async deleteTransaction(projectId, inventoryId, transactionId) {
    try {
      const response = await axios.delete(
        `${constants.BASE_URL}/projects/${projectId}/inventory/${inventoryId}/${transactionId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async listDocuments(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/documents`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getDocument(projectId, documentId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/documents/${documentId}/`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateDocumentAcl(projectId, documentId, ids) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/projects/${projectId}/documents/${documentId}/access`,
        { ids: ids }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async removeDocumentAcl(projectId, documentId, id) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/projects/${projectId}/documents/${documentId}/access/remove`,
        { _id: id }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateDocument(projectId, documentId, form) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/projects/${projectId}/document/${documentId}`,
        form
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async deleteDocument(projectId, documentId) {
    try {
      const response = await axios.delete(
        `${constants.BASE_URL}/projects/${projectId}/documents/${documentId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async listDocumentFolders(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/documentFolders`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addDocumentFolder(projectId, folderName, folderId) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/documents/${folderName}?folderId=${folderId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateFolderName(projectId, folderId, folderName, subfolderId) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/projects/${projectId}/updateFolder`,
        {
          Id: folderId,
          Name: folderName,
          subfolderId: subfolderId,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async listDrawingFolders(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/drawingFolders`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addDrawingFolder(projectId, folderName, folderType) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/drawing/${folderName}?folderType=${folderType}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateDrawingFolder(projectId, folderId, folderName, folderType) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/projects/${projectId}/updateDrawingFolder`,
        {
          Id: folderId,
          Name: folderName,
          Type: folderType,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async listDrawings(projectId, folderId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/drawings/details/${projectId}/${folderId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addDrawing(projectId, folderId, form) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/drawings/add/${folderId}`,
        {
          form: form,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async detailDrawing(projectId, drawingId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/drawings/detail/${drawingId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateDrawing(projectId, drawingId, form, folderId) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/drawings/${folderId}/updateDrawing`,
        {
          drawingId: drawingId,
          form: form,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async deleteDrawings(projectId, ids) {
    try {
      const response = await axios.post(
        constants.BASE_URL + `/drawings/delete/drawing`,
        {
          ids: ids,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async listSafetyNcrs(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/safetyNcrs/details/${projectId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addSafetyData(projectId, data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/safetyNcrs/add`,
        data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async detailSafetyData(safetyDataId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/safetyNcrs/detail/${safetyDataId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateSafetyData(safetyDataId, data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/safetyNcrs/${safetyDataId}/update`,
        data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  // async deleteSafetyNcrs(ids) {
  //   try {
  //     const response = await axios.post(
  //       constants.BASE_URL + `/safetyNcrs/delete/ncr`,
  //       {
  //         ids: ids,
  //       }
  //     );
  //     return response.data;
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  // async deleteQualityNcrs(ids) {
  //   try {
  //     const response = await axios.post(
  //       constants.BASE_URL + `/qualityNcrs/delete/ncr`,
  //       {
  //         ids: ids,
  //       }
  //     );
  //     return response.data;
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  async listQualityNcrs(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/qualityNcrs/details/${projectId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addQualityData(projectId, data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/qualityNcrs/add`,
        data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async detailQualityData(qualityDataId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/qualityNcrs/detail/${qualityDataId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateQualityData(qualityDataId, data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/qualityNcrs/${qualityDataId}/update`,
        data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async listMilestones(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/milestones`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addMilestone(projectId, data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/milestones/add`,
        data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async detailMilestone(projectId, milestoneId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/milestones/${milestoneId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateMilestone(projectId, milestoneId, data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/milestones/${milestoneId}/update`,
        data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async listItems(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/workBOQ/items`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addItem(projectId, data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/workBOQ/item/add`,
        data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async detailWorkBOQItem(projectId, itemId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/workBOQ/item/${itemId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateItem(projectId, itemId, data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/workBOQ/item/${itemId}/update`,
        data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getExecutableQty(projectId, itemId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/report/item/${itemId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async listPurchaseOrders(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/purchaseOrders/${projectId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async createPurchaseOrder(projectId, data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/purchaseOrders/${projectId}/create`,
        data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async detailPurchaseOrder(purchaseId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/purchaseOrders/get/${purchaseId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async fecthPurchaseOrderBySupplierId(supplierId, inventoryId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/purchaseOrders/getpo/${supplierId}?inventoryId=${inventoryId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updatepurchaseOrder(purchaseId, data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/purchaseOrders/${purchaseId}/update`,
        data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async listWorkOrders(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/workOrders`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async createWorkOrder(projectId, data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/workOrders/create`,
        data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async detailWorkOrder(projectId, workId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/workOrders/get/${workId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateworkOrder(projectId, workId, data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/workOrders/${workId}/update`,
        data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async downloadWO(projectId, workId) {
    let response = "";
    response = await axios.get(
      `${constants.BASE_URL}/projects/${projectId}/workOrders/${workId}/download`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async viewWO(projectId, workId) {
    let response = await axios.get(
      `${constants.BASE_URL}/projects/${projectId}/workOrders/${workId}/view`
    );
    return response.data;
  }

  async downloadPO(purchaseId) {
    let response = "";
    response = await axios.get(
      `${constants.BASE_URL}/purchaseOrders/${purchaseId}/download?downloadType=excel`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async downloadPOPdfReport(purchaseId) {
    let response = "";
    response = await axios.get(
      `${constants.BASE_URL}/purchaseOrders/${purchaseId}/download?downloadType=pdf`,
      { responseType: "arraybuffer" }
    );
    return response;
  }


  async downloadPOReport(projectId, projectName,supplier, startDate, endDate
    ) {
      let response = "";
       response = await axios.get(
      `${constants.BASE_URL}/purchaseOrders/${projectId}/download/report?supplierIds=${supplier}&startDate=${startDate}&endDate=${endDate}`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

 

  async downloadCubeRegisterExcelReport(
    projectId,
    projectName,
    suppliers,
    grades,
    filters
  ) {
    const response = await axios.post(
      `${constants.BASE_URL}/cubeRegister/download/${projectId}?projectName=${projectName}&startDate=${filters.startDate}&endDate=${filters.endDate}&userId=${filters.userId}`,
      {
        suppliers: suppliers,
        grades: grades,
      },
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async viewPO(purchaseId) {
    const response = await axios.get(
      `${constants.BASE_URL}/purchaseOrders/${purchaseId}/view`
    );
    return response.data;
  }

  async addTemplate(projectId, form) {
    try {
      const options = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/templates/add`,
        form,
        options
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateTemplate(projectId, templateId, newForm) {
    try {
      // const options = {
      //   headers: { "Content-Type": "multipart/form-data" },
      // };
      const response = await axios.put(
        `${constants.BASE_URL}/projects/${projectId}/template/${templateId}`,
        newForm
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addCheckList(projectId, values) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/checklist/add`,
        values
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async detailChecklist(projectId, checklistId, itemId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/checklist/${checklistId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateChecklistDetails(projectId, checklistId, details) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/updatechecklist/${checklistId}`,
        details
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async detailItem(projectId, checklistId, itemId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/checklist/${checklistId}/${itemId}/item`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addComment(projectId, checklistId, values) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/checklist/${checklistId}/comment`,
        values
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async deleteComment(projectId, checklistId, itemId, commentId) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/checklist/${checklistId}/delete/comment`,
        {
          itemId: itemId,
          commentId: commentId,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async markChecklistItem(projectId, checklistId, itemId, value, markedBy) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/projects/${projectId}/checklist/${checklistId}/${itemId}/${value}`,
        {
          markedBy: markedBy,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async deleteChecklists(projectId, values) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/checklists/delete`,
        {
          checklistIds: values,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async deleteTemplates(projectId, values) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/templates/delete`,
        {
          templateIds: values,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getReports(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/reports`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getDetailReport(projectId, reportId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/report/${reportId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async saveReport(projectId, formData) {
    try {
      const options = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/save`,
        formData,
        options
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateReportDate(projectId, data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/updateDate`,
        data
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addLabourData(projectId, reportId, Data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/${reportId}/addLabour`,
        Data
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateLabourData(projectId, type, reportId, Data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/${reportId}/${type}/updateLabour`,
        Data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addEquipmentData(projectId, reportId, Data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/${reportId}/addEquipment`,
        Data
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateEquipmentData(projectId, type, reportId, Data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/${reportId}/${type}/updateEquipment`,
        Data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addHindranceData(projectId, reportId, Data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/${reportId}/addHindrance`,
        Data
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateHindranceData(projectId, type, reportId, Data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/${reportId}/${type}/updateHindrance`,
        Data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }


  async addIndentData( data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/intent/project/add`,
        data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateIndentData(indentId, data) {
    try {
      const response = await axios.patch(
        `${constants.BASE_URL}/intent/project/${indentId}`,
        data
      );
      console.log("responseupdate",response.data)
      return response.data;

    } catch (e) {
      throw e;
    }
  }

  
  

  async detailIndent(indentId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/intent/project/${indentId}`
      );
      console.log("responsedata123",response)
      console.log("response",response.data.status)
      return response;
    } catch (e) {
      throw e;
    }
  }



async listIndent(projectId, page, limit) {
  try {
      const response = await axios.get(
          `${constants.BASE_URL}/intent/project/listing`,
          { params :{projectId, page, limit} }
      );
      console.log("Response data:", response.data);
      console.log("Response data1:", response);

      return response.data;
  } catch (e) {
      console.error("Error:", e);
      throw e;
  }
}



  async addSiteVisitorData(projectId, reportId, Data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/${reportId}/addSiteVisitor`,
        Data
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateSiteVisitorData(projectId, type, reportId, Data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/${reportId}/${type}/updateSiteVisitor`,
        Data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addStaffData(projectId, reportId, Data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/${reportId}/addStaff`,
        Data
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateStaffData(projectId, type, reportId, Data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/${reportId}/${type}/updateStaff`,
        Data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addNotesData(projectId, reportId, Data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/${reportId}/addNotes`,
        Data
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateNotesData(projectId, type, reportId, Data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/${reportId}/${type}/updateNotes`,
        Data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addWorkProgressData(projectId, reportId, Data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/${reportId}/addworkProgress`,
        Data
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateWorkProgressData(projectId, type, reportId, Data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/${reportId}/${type}/updateworkProgress`,
        Data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async uploadAttachments(projectId, reportId, Data) {
    try {
      const options = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/${reportId}/uploadAttachments`,
        Data,
        options
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async deleteAttachments(projectId, reportId, Data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/${reportId}/deleteAttachments`,
        Data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addMaterialData(projectId, reportId, Data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/${reportId}/addMaterial`,
        Data
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateMaterialData(projectId, type, reportId, Data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/${reportId}/${type}/updateMaterial`,
        Data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async deleteMaterialTransaction(projectId, reportId, Data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/${reportId}/deleteMaterialTransaction`,
        Data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addConsumptionData(projectId, reportId, Data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/${reportId}/addConsumption`,
        Data
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateConsumptionData(projectId, type, reportId, Data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/report/${reportId}/${type}/updateConsumption`,
        Data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async submitReport(projectId, reportId) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/reports/submit`,
        {
          _id: reportId,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async approveReport(projectId, reportId) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/reports/approve`,
        {
          _id: reportId,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async revertReport(projectId, reportId, note) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/reports/revert`,
        {
          _id: reportId,
          note: note,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addEntryToSummary(projectId, userId, reportName, actionType, title) {
    const response = await axios.post(
      `${constants.BASE_URL}/projects/${projectId}/reportSummry`,
      {
        userId: userId,
        reportName: reportName,
        actionType: actionType,
        title: title,
      }
    );
    return response.data;
  }

  async checklistUpload(projectId, uploadFile) {
    try {
      const response = axios({
        method: "post",
        url: `${constants.BASE_URL}/projects/${projectId}/checklist/upload`,
        data: uploadFile,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async downloadDailyReport(projectId, reportId, userId, orgType) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/reports/${reportId}/${userId}/download?orgType=${orgType}`,
        { responseType: "arraybuffer" }
      );
      return response;
    } catch (e) {
      throw e;
    }
  }

  async downloadPdfDailyReport(projectId, reportId, userId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/reports/${reportId}/${userId}/pdf/download`,
        { responseType: "arraybuffer" }
      );
      return response;
    } catch (e) {
      throw e;
    }
  }

  async viewDailyReport(projectId, reportId, userId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/reports/${reportId}/${userId}/view`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async sendDailyReport(projectId, reportId, userId, emails) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/reports/${reportId}/${userId}/send`,
        {
          emails: emails,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async downloadTaskExcelReport(projectId, projectName, today, userId) {
    const response = await axios.get(
      `${constants.BASE_URL}/projects/${projectId}/download/${userId}`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async downloadTaskPdfReport(projectId, userId) {
    const response = await axios.get(
      `${constants.BASE_URL}/projects/${projectId}/reports/${userId}/tasks`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async downloadInventoryReport(projectId) {
    const response = await axios.get(
      `${constants.BASE_URL}/projects/${projectId}/reports/inventory`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async downloadChecklist(projectId, checklistId) {
    const response = await axios.get(
      `${constants.BASE_URL}/projects/${projectId}/checklist/${checklistId}/report`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async viewChecklist(projectId, checklistId) {
    const response = await axios.get(
      `${constants.BASE_URL}/projects/${projectId}/checklist/${checklistId}/viewreport`
    );
    return response.data;
  }

  async downloadInventoryExcelReport(projectId, filters, suppliers) {
    let response = "";
    if (filters.inventoryId === "all") {
      response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/inventory/report/download?startDate=${filters.startDate}&endDate=${filters.endDate}&type=${filters.type}&userId=${filters.userId}&suppliers=${suppliers}`,
        {
          suppliers: suppliers,
        },
        { responseType: "arraybuffer" }
      );
    } else if (filters.inventoryId === "Multiple") {
      response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/inventory/multiple/report/download?startDate=${filters.startDate}&endDate=${filters.endDate}&type=${filters.type}&userId=${filters.userId}&suppliers=${suppliers}`,
        {
          inventoryIds: filters.inventoryIds,
          suppliers: suppliers,
        },
        { responseType: "arraybuffer" }
      );
    } else {
      response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/inventory/${filters.inventoryId}/report/download?startDate=${filters.startDate}&endDate=${filters.endDate}&userId=${filters.userId}&suppliers=${suppliers}`,
        {
          suppliers: suppliers,
        },
        { responseType: "arraybuffer" }
      );
    }
    return response;
  }

  async downloadSingleInventoryExcelReport(projectId, inventoryId, filters) {
    let response = "";
    response = await axios.get(
      `${constants.BASE_URL}/projects/${projectId}/inventory/${inventoryId}/report/download?startDate=${filters.startDate}&endDate=${filters.endDate}&userId=${filters.userId}`,
      { responseType: "arraybuffer" }
    );

    return response;
  }

  async downloadLabourExcelReport(projectId, projectName, filters) {
    let response = "";
    filters.vendorName = filters.vendorName.replace(/&/g, "%26");
    response = await axios.get(
      `${constants.BASE_URL}/projects/${projectId}/labour/report/download?projectName=${projectName}&startDate=${filters.startDate}&endDate=${filters.endDate}&vendorName=${filters.vendorName}&userId=${filters.userId}`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async downloadDrawingExcelReport(projectId, projectName, filters) {
    let response = "";
    response = await axios.get(
      `${constants.BASE_URL}/drawings/report/${projectId}/download?projectName=${projectName}&folderId=${filters.drawingId}&startDate=${filters.startDate}&endDate=${filters.endDate}&drawingName=${filters.drawingName}&drawingType=${filters.drawingType}&userId=${filters.userId}`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async downloadIrExcelReport(projectId, projectName, filters) {
    let response = "";
    response = await axios.get(
      `${constants.BASE_URL}/irs/report/${projectId}/download?projectName=${projectName}&folderId=${filters.irId}&startDate=${filters.startDate}&endDate=${filters.endDate}&irName=${filters.irName}&irType=${filters.irType}&userId=${filters.userId}`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async downloadRfiExcelReport(projectId, projectName, filters) {
    let response = "";
    response = await axios.get(
      `${constants.BASE_URL}/rfis/report/${projectId}/download?projectName=${projectName}&startDate=${filters.startDate}&endDate=${filters.endDate}&rfiType=${filters.rfiType}&userId=${filters.userId}`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async downloadGfcExcelReport(projectId, projectName, filters) {
    let response = "";
    response = await axios.get(
      `${constants.BASE_URL}/gfcs/report/${projectId}/download?projectName=${projectName}&startDate=${filters.startDate}&endDate=${filters.endDate}&userId=${filters.userId}`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async viewSafetyNcrExcelReport(projectId, projectName, filters) {
    let response;
    response = await axios.get(
      `${constants.BASE_URL}/safetyNcrs/view/${projectId}?projectName=${projectName}&startDate=${filters.startDate}&endDate=${filters.endDate}&userId=${filters.userId}`
    );
    return response.data;
  }

  async downloadSafetyNcrExcelReport(projectId, projectName, filters) {
    let response = "";
    response = await axios.get(
      `${constants.BASE_URL}/safetyNcrs/download/${projectId}?projectName=${projectName}&startDate=${filters.startDate}&endDate=${filters.endDate}&userId=${filters.userId}`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async downloadQualityNcrExcelReport(projectId, projectName, filters) {
    let response = "";
    response = await axios.get(
      `${constants.BASE_URL}/qualityNcrs/download/${projectId}?projectName=${projectName}&startDate=${filters.startDate}&endDate=${filters.endDate}&userId=${filters.userId}`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async downloadEquipmentExcelReport(projectId, projectName, filters) {
    let response = "";
    response = await axios.get(
      `${constants.BASE_URL}/projects/${projectId}/equipment/report/download?projectName=${projectName}&startDate=${filters.startDate}&endDate=${filters.endDate}&userId=${filters.userId}`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async downloadConsumptionExcelReport(projectId, projectName, filters) {
    let response = "";
    response = await axios.post(
      `${constants.BASE_URL}/projects/${projectId}/consumption/report/download?projectName=${projectName}&startDate=${filters.startDate}&endDate=${filters.endDate}&userId=${filters.userId}`,
      filters,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async downloadHindranceExcelReport(projectId, projectName, filters) {
    let response = "";
    response = await axios.get(
      `${constants.BASE_URL}/projects/${projectId}/hindrance/report/download?projectName=${projectName}&startDate=${filters.startDate}&endDate=${filters.endDate}&userId=${filters.userId}`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async downloadSitevisitorExcelReport(projectId, projectName, filters) {
    let response = "";
    response = await axios.get(
      `${constants.BASE_URL}/projects/${projectId}/sitevisitor/report/download?projectName=${projectName}&startDate=${filters.startDate}&endDate=${filters.endDate}&userId=${filters.userId}`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async downloadStaffExcelReport(projectId, projectName, filters) {
    let response = "";
    response = await axios.get(
      `${constants.BASE_URL}/projects/${projectId}/staff/report/download?projectName=${projectName}&startDate=${filters.startDate}&endDate=${filters.endDate}&userId=${filters.userId}`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async downloadAttachmentExcelReport(projectId, projectName, filters) {
    let response = "";
    response = await axios.get(
      `${constants.BASE_URL}/projects/${projectId}/attachment/report/download?projectName=${projectName}&startDate=${filters.startDate}&endDate=${filters.endDate}&userId=${filters.userId}`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async downloadNotesExcelReport(projectId, projectName, filters) {
    let response = "";
    response = await axios.get(
      `${constants.BASE_URL}/projects/${projectId}/notes/report/download?projectName=${projectName}&startDate=${filters.startDate}&endDate=${filters.endDate}&userId=${filters.userId}&orgType=${filters.orgType}`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async downloadWorkProgressExcelReport(projectId, projectName, filters) {
    let response = "";
    response = await axios.get(
      `${constants.BASE_URL}/projects/${projectId}/workProgress/report/download?projectName=${projectName}&startDate=${filters.startDate}&endDate=${filters.endDate}&userId=${filters.userId}`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async downloadTemplate(projectId, templateId) {
    const response = await axios.get(
      `${constants.BASE_URL}/projects/${projectId}/template/${templateId}/download`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async downloadStructuralAuditReport(projectId, filter) {
    let response = "";
    if (filter === "html") {
      response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/audit/report/html`
      );
    } else {
      response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/audit/report/pdf`,
        { responseType: "arraybuffer" }
      );
    }

    return response;
  }

  async getVendors(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/vendors/list/${projectId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async detailVendor(vendorId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/vendors/${vendorId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addVendor(projectId, form) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/vendors/add/${projectId}`,
        form
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateVendor(vendorId, form) {
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

  async importInventory(projectId, payload) {
    try {
      const response = await axios({
        method: "post",
        url: `${constants.BASE_URL}/projects/${projectId}/inventory/import`,
        data: payload,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  // async importTransactions(projectId, inventoryId, payload) {
  //   try {
  //     const response = await axios({
  //       method: "post",
  //       url: `${constants.BASE_URL}/projects/${projectId}/transaction/${inventoryId}/import`,
  //       data: payload,
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     return response.data;
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  //   async importDailyDataEntries(projectId, payload) {
  //     try {
  //       const response = await axios({
  //         method: "post",
  //         url: `${constants.BASE_URL}/projects/${projectId}/daily-data/import`,
  //         data: payload,
  //         headers: { "Content-Type": "multipart/form-data" },
  //       });
  //       return response.data;
  //     } catch (e) {
  //       throw e;
  //     }
  // }

  async importVendor(projectId, payload) {
    try {
      const response = await axios({
        method: "post",
        url: `${constants.BASE_URL}/projects/${projectId}/vendor/import`,
        data: payload,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async exportVendor(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/vendor/export`
      );
      return response;
    } catch (e) {
      throw e;
    }
  }
  async downloadInvoiceExcelReport(projectId, billId, userId) {
    let response = "";
    response = await axios.get(
      `${constants.BASE_URL}/billings/${projectId}/invoice/billing/download?billId=${billId}&userId=${userId}`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async viewInvoiceReport(projectId, billId, userId) {
    let response = await axios.get(
      `${constants.BASE_URL}/billings/${projectId}/invoice/billing/view?billId=${billId}&userId=${userId}`
    );
    return response.data;
  }

  async addbilling(projectId, data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/billings/add/${projectId}`,
        data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getBillings(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/billings/list/${projectId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateBill(projectId, billId, data) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/billings/${billId}/${projectId}`,
        data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async detailBilling(billingId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/billings/${billingId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getBillingLastRecord(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/billings/invoice/${projectId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addbill(projectId, data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/bill/add`,
        data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getbills(projectId, data) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/bills`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async detailBill(projectId, billId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/bill/${billId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async billUpdate(projectId, billId, data) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/projects/${projectId}/billUpdate/${billId}`,
        data
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  //   async deleteBillData(projectId, billId, orderId ) {
  //     try {
  //       const response = await axios.get(
  //         `${constants.BASE_URL}/projects/${projectId}/bill/${billId}/order?orderId=${orderId}`
  //       );
  //       return response.data;
  //     } catch (e) {
  //       throw e;
  //     }
  // }

  async downloadBillExcelReport(projectId, billId) {
    let response = "";
    response = await axios.get(
      `${constants.BASE_URL}/projects/${projectId}/billReport/download?billId=${billId}`,
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async downloadBillRegisterExcelReport(projectId,filters) {
    const response = await axios.post(
      `${constants.BASE_URL}/projects/${projectId}/billregister/report/download?startDate=${filters.startDate}&endDate=${filters.endDate}&type=detail&userId=${filters.userId}`,
      {
        suppliers: []
      },
      {
        responseType: "arraybuffer"
      }
    );
    return response;
  }

  async viewBillExcelReport(projectId, billId) {
    let response = await axios.get(
      `${constants.BASE_URL}/projects/${projectId}/billReport/view?billId=${billId}`
    );
    return response.data;
  }

  async listObservations(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/observations`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getObservations(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/getobservations`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }
  async addObservation(projectId, payload) {
    try {
      const response = await axios({
        method: "post",
        url: `${constants.BASE_URL}/projects/${projectId}/observation`,
        data: payload,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  //   async importCubeEntries(projectId, payload) {
  //     try {
  //       const response = await axios({
  //         method: "post",
  //         url: `${constants.BASE_URL}/cubeRegister/${projectId}/cube/import`,
  //         data: payload,
  //         headers: { "Content-Type": "multipart/form-data" },
  //       });
  //       return response.data;
  //     } catch (e) {
  //       throw e;
  //     }
  // }

  async getCubeRegister(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/cubeRegister/details/${projectId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateSample(sampleId, form) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/cubeRegister/${sampleId}`,
        form
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addCubeRegister(finalData) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/cubeRegister/add`,
        finalData
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async detailSample(sampleId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/cubeRegister/${sampleId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async downloadCubeRegisterExcelReport(
    projectId,
    projectName,
    suppliers,
    grades,
    filters
  ) {
    const response = await axios.post(
      `${constants.BASE_URL}/cubeRegister/download/${projectId}?projectName=${projectName}&startDate=${filters.startDate}&endDate=${filters.endDate}&userId=${filters.userId}`,
      {
        suppliers: suppliers,
        grades: grades,
      },
      { responseType: "arraybuffer" }
    );
    return response;
  }

  async getInformation(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/audit/details`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addInformation(projectId, form) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/${projectId}/audit/details`,
        form
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addRepairHistory(projectId, form) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/projects/${projectId}/repair/add`,
        form
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateInformation(projectId, form) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/projects/${projectId}/audit/details`,
        form
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async exportItemDocument(projectId, itemId, itemName, documents) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/projects/export/${projectId}/item/${itemName}`,
        documents,
        { responseType: "arraybuffer" }
      );
      return response;
    } catch (e) {
      throw e;
    }
  }

  async getReportSummary(projectId, date) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/projects/${projectId}/reports/summary?reportDate=${date}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getSSADashboard(orgId, reportDate, userId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/dashboard/ssa/${orgId}?reportDate=${reportDate}&userId=${userId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getDashboardAsPerProject(projectId, invId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/dashboard/project/${projectId}?invId=${invId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addIrFolder(projectId, folderName) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/irFolder/${projectId}/add/${folderName}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async listIrFolders(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/irFolder/${projectId}/folders`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateIrFolder(projectId, folderId, folderName) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/irFolder/${projectId}/updateIrFolder`,
        {
          folderId: folderId,
          folderName: folderName,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addGfcFolder(projectId, folderName) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/gfcFolder/${projectId}/add/${folderName}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async listGfcFolders(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/gfcFolder/${projectId}/folders`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateGfcFolder(projectId, folderId, folderName) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/gfcFolder/${projectId}/updateGfcFolder`,
        {
          folderId: folderId,
          folderName: folderName,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async listIrs(projectId, folderId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/irs/details/${projectId}/${folderId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addIr(form) {
    try {
      const response = await axios.post(`${constants.BASE_URL}/irs/add`, {
        form: form,
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async detailIr(projectId, irId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/irs/detail/${irId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateIr(irId, form) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/irs/${irId}/updateIr`,
        {
          form: form,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async deleteIrs(projectId, ids) {
    try {
      const response = await axios.post(constants.BASE_URL + `/irs/delete/ir`, {
        ids: ids,
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async listGfcs(projectId, folderId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/gfcs/details/${projectId}/${folderId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addGfc(form) {
    try {
      const response = await axios.post(`${constants.BASE_URL}/gfcs/add`, {
        form: form,
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async detailGfc(projectId, gfcId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/gfcs/detail/${gfcId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateGfc(gfcId, form) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/gfcs/${gfcId}/updateGfc`,
        {
          form: form,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async listRfis(projectId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/rfis/details/${projectId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async addRfi(form) {
    try {
      const response = await axios.post(`${constants.BASE_URL}/rfis/add`, {
        form: form,
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async detailRfi(projectId, rfiId) {
    try {
      const response = await axios.get(
        `${constants.BASE_URL}/rfis/detail/${rfiId}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async updateRfi(rfiId, form) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/rfis/${rfiId}/updateRfi`,
        {
          form: form,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}

const instance = new ProjectService();
export default instance;
