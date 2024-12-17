import { Component, OnInit } from '@angular/core';
import { Foods } from '../../../../../entity/food/foods';
import { UsersService } from '../../../../../service/userService/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchFilterUserService } from '../../../../../service/userService/search-filter-user.service';
import { Users } from '../../../../../entity/user/users';

@Component({
  selector: 'app-listuser',
  templateUrl: './listuser.component.html',
  styleUrl: './listuser.component.css'
})
export class ListuserComponent implements OnInit {
  user!: Users[];
  filteredUsers!: Users[];
  number = 0;
  totalPages = 0;
  
  theTotalElements: number = 0;
  size: number = 15;
  currentCategoryId: number = 1; 
 fullnameFilter!: string ;
  usernameFilter!: string ;
  isAdminFilter: string='123';
  isChangedPassFilter: string='123';

  constructor(
    private userService: UsersService,

    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private searchFilterUserService: SearchFilterUserService
  ) {}

  ngOnInit(): void {
    this.getAllUsers()
  }

  getAllUsers() {
    this.searchFilterUserService.filterUser(this.usernameFilter, this.fullnameFilter, this.isAdminFilter,this.isChangedPassFilter , this.number, this.size).subscribe(
      data => {
        this.filteredUsers = data.result.content;         
        this.theTotalElements = data.result.totalElements;            
        this.totalPages = data.result.totalPages;         
      },
      error => {
      }
    );
    
}
paging(numberPage: number) {
  this.number = numberPage;
  this.getAllUsers();  
}

editUser(idUser: string) {
  this.router.navigate(['/admin/manager/managerUser/managerUser', idUser]);
}

}