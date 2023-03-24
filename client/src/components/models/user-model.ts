export class UserModel {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly registered_at: string,
    public readonly authorised_at: string,
    public readonly status?: string
  ) {}
}
