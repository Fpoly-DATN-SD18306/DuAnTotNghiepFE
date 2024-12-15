import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../../../../service/userService/users.service';
import { ActivatedRoute } from '@angular/router';
import { userResponse } from '../../../../../entity/response/user-response';

@Component({
  selector: 'app-manager-user',
  templateUrl: './manager-user.component.html',
  styleUrls: ['./manager-user.component.css']
})
export class ManagerUserComponent implements OnInit {
  userForm!: FormGroup;
  idUserNeedUpdate!: String;
  imgUser: string = "./img/noImage.jpg";
  hostingImg = "";
  selectedFiles!: File;
  isEditing = false;
  loader = false;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private snackBar: MatSnackBar,
    private router: ActivatedRoute
  ) { }

   errorNotify : Record<number,string> ={
    1701 :"Username này đã tồn tại !"
   }

  ngOnInit(): void {
    this.refreshForm();

    this.router.params.subscribe(param => {
      const userId = param['id'];
      if (userId) {
        this.isEditing = true;
        this.userService.getById(userId).subscribe(
          data => {

            const userResponse = data.result as userResponse;
            this.idUserNeedUpdate = userResponse.idUser;
            this.userForm.patchValue({
              fullname: userResponse.fullname,
              username: userResponse.username,
              isAdmin: userResponse.isAdmin,
              isDeleted: userResponse.isDeleted,
              isChangedPass: userResponse.isChangedPass,
              imgUser: userResponse.imgUser
            });
            this.imgUser = userResponse.imgUser
              ? `${this.hostingImg}${userResponse.imgUser}`
              : './img/noImage.jpg';
          },
          error => console.error("Error fetching user data:", error)
        );
      }

    });
  }
  resertPassword() {
    const formData = new FormData();
    formData.append('fullname', this.userForm.value.fullname);
    formData.append('username', this.userForm.value.username);
    formData.append('password', '123');
    formData.append('isAdmin', this.userForm.value.isAdmin.toString());
    formData.append('isDeleted', this.userForm.value.isDeleted.toString());
    if (this.selectedFiles) {
      formData.append('file', this.selectedFiles);
    }
    this.userService.putUser(formData, this.idUserNeedUpdate).subscribe(
      () => this.openToast("Làm mới mật khẩu Thành Công"),
      error => this.openToast("Làm mới mật khẩu Không thành công")
    );
  }

  refreshForm() {
    this.userForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      username: ['', Validators.required],
      isAdmin: [false, Validators.required],
      isDeleted: [false, Validators.required],
      imgUser: ['']
    });
  }

  changeImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.openToast("Chỉ chấp nhận file ảnh (JPG, PNG)");
        return;
      }
      this.selectedFiles = file;
      this.imgUser = URL.createObjectURL(file);
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      if (this.isEditing) {
        this.putUser();
      } else {
        this.createUser();
      }
    }
  }

  createUser() {
    const formData = this.prepareFormData();
    this.loader = true;
    this.userService.postUser(formData).subscribe(
      data => {
        this.loader = false
        this.openToast("Thêm nhân viên mới Thành Công")
      },
      error => {
        this.openToast(this.errorNotify[1701])
        this.loader =false
      }
    );
  }

  putUser() {
    this.loader = true;
    const formData = this.prepareFormData();
    this.userService.putUser(formData, this.idUserNeedUpdate).subscribe(
      data => {
        this.loader = false
        this.openToast("Sửa Thành Công")
      },
      error => {
        this.openToast("Sửa Không thành công")
        this.loader =false
      }
    );
  }

  prepareFormData(): FormData {
    const formData = new FormData();
    this.userForm.get('password')?.enable();
    formData.append('fullname', this.userForm.value.fullname);
    formData.append('username', this.userForm.value.username);
    formData.append('isAdmin', this.userForm.value.isAdmin.toString());
    formData.append('isDeleted', this.userForm.value.isDeleted.toString());

    if (this.selectedFiles) {
      formData.append('file', this.selectedFiles);
    }
    return formData;
  }

  openToast(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  resetForm(): void {
    window.location.assign("/admin/manager/managerUser/managerUser");
  }
}
