export class User {
  constructor(
    public _id: string,
    public email: string,
    public username: string,
    public favorites: string[],
    public password?: string,
    public avatarUrl?: string
  ) {}
}
