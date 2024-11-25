import { ChartData } from "./chart-data";
import { ReportRespone } from "./report-respone";

export interface ReportData {
    
    reportData?:ReportRespone;
    chartData: ChartData[];
  }