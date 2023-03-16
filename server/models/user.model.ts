export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  registeredAt: Date;
  authorizedAt: Date;
  status: string;
}
