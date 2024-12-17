import { ReportRequest } from './../../../../entity/request/report-request';
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../../service/reportService/report.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportRespone } from '../../../../entity/response/report-respone';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { error } from 'console';
import { Chart, ChartType, registerables } from 'chart.js';
import { ChartData } from '../../../../entity/response/chart-data';
import { ReportData } from '../../../../entity/response/IReportData';
Chart.register(...registerables)
@Component({
  selector: 'app-managerview-report',
  templateUrl: './managerview-report.component.html',
  styleUrl: './managerview-report.component.css'
})
export class ManagerviewReportComponent implements OnInit{
  endDate!:string
  startDate!:string
  report!:ReportData;
  reportRespone ?: ReportRespone;
  chartData :ChartData[]=[];
  data:any[]=[];
  label:any[]=[];
  groupBy:string="day";
  public  config : any = {
    type: 'line',
    
    data :{
      labels: this.label,
      datasets: [{
        label: 'Doanh thu',
        data: this.data,
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    }
  };
  chart:any;
  constructor(private reportService: ReportService, private snackBar: MatSnackBar ){
    this.setMonthRange();
    
  }
  formatPrice(price :number){

    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  setMonthRange() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    const firstDayOfMonth = new Date(year, month - 1, 1);
    this.startDate = firstDayOfMonth.toISOString().slice(0, 10);

    // const lastDayOfMonth = new Date(year, month, 0);
    this.endDate = today.toISOString().slice(0, 10);
}
  openTotast(status: string) {
    this.snackBar.open
      (status, "Đóng", {
        duration: 4000,
        horizontalPosition: 'end', //  'start', 'end'
        verticalPosition: 'bottom', //  'bottom'
      })
  }
  validateDates() {
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);
  
    if (isNaN(startDate.getTime())) {
      this.openTotast('Vui lòng nhập ngày bắt đầu.');
      return false; // Indicate validation failure
    }
  
    if (isNaN(endDate.getTime())) {
      this.openTotast('Vui lòng nhập ngày kết thúc.');
      return false; // Indicate validation failure
    }
  
    if (endDate < startDate) {
      this.openTotast('Ngày kết thúc phải sau ngày bắt đầu.');
      return false;
    }
  
    return true;
  }
  searchReport(emitEvent = true) {
    if (!emitEvent) {
      return; 
    }
  
    if (!this.validateDates()) {
      return; 
    }
  
    this.getReport();
  }
  
  groupByChange() {
    this.searchReport(false); // Gọi searchReport với emitEvent là false
  }
// getData(){}
getReport(){
  
  this.reportService.filterReport(this.startDate,this.endDate,this.groupBy).subscribe(
    data =>{
      this.report=data.result
      this.reportRespone=this.report.reportData
  
      this.chartData = this.report.chartData;
   
      this.getChartData();
    },
    error => {

    }
  );
}
getChartData(){
  this.label= this.chartData.map(item => [item.labels]);
  this.data = this.chartData.map(item => item.values);

  this.config.data.labels = this.label;
  this.config.data.datasets[0].data = this.data;
  this.chart.update();}
ngOnInit() {
  this.chart= new Chart('myChart',this.config);
  this.getReport()



  }
}
