export class userRequest {
    constructor(public fullname: string, public username: string
        , public password: string, public isAdmin: Boolean
        , public isDeleted: Boolean,public isChangedPass : Boolean) { }
}
