import { HttpService } from "./httpService";

class UserManagementService {
  private request = new HttpService();

  async getListOfBuyers(pagination: { page: number; limit: number }) {
    return this.request.get(
      `/admin/users/admin-buyers?page=${pagination.page}&limit=${pagination.limit}`
    );
  }
}

const userManagementService = new UserManagementService();
export default userManagementService;
