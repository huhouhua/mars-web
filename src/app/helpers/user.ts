export class User {
  accessToken?: AccessToken;
  session?: Session;
}

export class AccessToken {
  access_token?: string;
  token_type?: string;
  refresh_token?: string;
  scope?: string;
  created_at?: string;
}
export class Session {
  id?: number;
  email?: string;
  can_create_project?: boolean;
  access_token?: string;
  bio?: string;
  avatar_url?: string;
  can_create_group?: boolean;
  created_at?: string;
  color_scheme_id?: number;
  current_sign_in_at?: string;
  linkedin?: string;
  skype?: string;
  is_admin?: boolean;
  private_token?: string;
  name?: string;
  projects_limit?: string;
  twitter?: string;
  username?: string;
  state?: string;
  two_factor_enabled?: string;
  website_url?: string;
}
