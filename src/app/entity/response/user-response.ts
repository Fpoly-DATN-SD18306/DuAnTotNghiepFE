export class userResponse {
    constructor(public idUser : string ,public fullname: string, public username: string
        , public password: string, public imgUser: string, public isAdmin: Boolean
        , public isDeleted: Boolean) { }
}
