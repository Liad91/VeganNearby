import { User } from './user.model';

export class AuthSuccessResponse {
  token: string;
  user: User;
}

export class AuthFailedResponse {
  failed: true
}
