import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { UserRepository } from "../repositories/userRepository";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async createUser(user: User): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await this.userRepository.create(user);
  }

  async updateUser(id: number, user: User): Promise<void> {
    await this.userRepository.update(id, user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
  async login(email: string, password: string): Promise<string | null> {
    const user = await this.userRepository.findByEmailAndPassword(
      email,
      password
    );
    if (user && (await bcrypt.compare(password, user.password))) {
      return jwt.sign({ email: user.email, id: user.id }, "secretkey");
    }
    return null;
  }
}
