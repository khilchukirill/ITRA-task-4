export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  registeredAt?: string;
  authorizedAt?: string;
  status?: string;
}
