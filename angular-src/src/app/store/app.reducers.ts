import { ActionReducerMap } from '@ngrx/store'

import * as AuthReducers from './../core/auth/store/auth.reducers';

export interface AppState {
  auth: AuthReducers.State
}

export const reducers: ActionReducerMap<AppState> = {
  auth: AuthReducers.authReducer
}
