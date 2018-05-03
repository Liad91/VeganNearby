export class User {
  constructor(
    public _id: string,
    public email: string,
    public name: string,
    public favorites: string[],
    public background: number,
    public password?: string,
    public avatarUrl?: string
  ) {}
}
