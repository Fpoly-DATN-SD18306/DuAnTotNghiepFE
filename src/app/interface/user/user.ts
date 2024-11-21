export interface User {
    idUser: string; // Change from UUID to string for easier handling
  fullname: string;
  username: string;
  password: string; // Consider not including password in the interface for security reasons
  isAdmin?: boolean; // Optional property for admin status
  isDeleted?: boolean; // Optional property for deleted status
  imgUser: string;
}
