export default interface IUser {
    id: string,
    name: string,
    email: string
}

export interface IUserProfile {
    username: string,
    email: string,
    firstname: string | false,
    lastname: string | false,
    surname: string | false,
    phone: number | false,
    birthday: Date | false,
}