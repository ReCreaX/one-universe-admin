import { HttpService } from "./httpService";

class DashboardService {
  private request = new HttpService();

  async getDashboardMonthlyStats() {
    return this.request.get("/admin/users/dashboard-stats/monthly");
  }

  async getDashboardChartGrowth(filter: "monthly" | "weekly" | "daily") {
    return this.request.get(
      `/admin/users/dashboard-stats/user-growth-chart?period=${filter}`
    );
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
