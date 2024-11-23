import { ReportRequest } from './../../../../entity/request/report-request';
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../../service/reportService/report.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportRespone } from '../../../../entity/response/report-respone';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { error } from 'console';
import { Chart, ChartType, registerables } from 'chart.js';
import { ChartData } from '../../../../entity/response/chart-data';
Chart.register(...registerables)
@Component({
  selector: 'app-managerview-report',
  templateUrl: './managerview-report.component.html',
  styleUrl: './managerview-report.component.css'
})
export class ManagerviewReportComponent implements OnInit{
  endDate!:string
  startDate!:string
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

    
  }
  formatPrice(price :number){

    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }


  openTotast(status: string) {
    this.snackBar.open
      (status, "Đóng", {
        duration: 4000,
        horizontalPosition: 'end', //  'start', 'end'
        verticalPosition: 'bottom', //  'bottom'
      })
  }
  changeStartDate(){
    const startDate = new Date(this.startDate);
   
    if (isNaN(startDate.getTime())) {
      this.openTotast('Vui lòng nhập ngày bắt đầu. ');
      return;
    }
  }
  changeEndDate(){
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);
    if (isNaN(endDate.getTime())) {
      this.openTotast('Vui lòng nhập ngày kết thúc.');
      return;
    }
    if (endDate < startDate) {
      this.openTotast('Ngày kết thúc phải sau ngày bắt đầu.');
      return;
    }
  }
  searchReport(){
    this.changeEndDate();
    this.changeStartDate();
    this.getReport(); 
  }
getReport(){
  this.reportService.filterReport(this.startDate,this.endDate).subscribe(
    data =>{
      this.reportRespone=data.result
      console.log("bao cao",this.reportRespone)
    },
    error => {
      console.log('Error fetching data:', error);
    }
  );
}
getChartData() {
  this.reportService.filterChart(this.groupBy).subscribe(
    data => {
      this.chartData = data.result;
      console.log("bao cao", this.chartData);
      this.label= this.chartData.map(item => [item.labels]); // Chuyển thành mảng một chiều
      this.data = this.chartData.map(item => item.values);

      this.config.data.labels = this.label;
      this.config.data.datasets[0].data = this.data;
      this.chart.update();
    },
    error => {
      console.log('Error fetching data:', error);
    }
  );
}

ngOnInit() {
  this.chart= new Chart('myChart',this.config);
  this.getReport()
  this.getChartData()


  }
}
