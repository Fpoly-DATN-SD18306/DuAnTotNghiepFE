import { Component } from '@angular/core';
import { Table } from '../../../../interface/table/table';
import { TableService } from './table.service';

@Component({
  selector: 'app-managerview-table',
  templateUrl: './managerview-table.component.html',
  styleUrl: './managerview-table.component.css'
})
export class ManagerviewTableComponent {
  tables: Table[] = [];
  tableName = '';
  filters = {
    status: ''
  };
  sortBy = 'name';
  sortOrder = 'asc';

  constructor(private tableService: TableService) {}

  ngOnInit() {
    this.tableService.getTables().subscribe(tables => {
      this.tables = tables;
    });
  }
  searchTables() {
    this.tableService.searchTables(this.tableName)
      .subscribe(tables => {
        this.tables = tables;
      });
  }
}

