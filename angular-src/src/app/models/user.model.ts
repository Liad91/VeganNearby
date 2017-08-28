export class User {
	constructor(
		public email: string,
		public password?: string,
		public username?: string,
		public _id?: string,
		public avatarUrl?: string
	) {}
}
