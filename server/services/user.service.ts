import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { UserRepository } from "../repositories/userRepository";
const keys = require("../config/keys");

export class UserService {
  private readonly saltRounds = 10;

  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async createUser(user: User): Promise<void> {
    await this.validateEmail(user.email);

    const hashedPassword = await this.hashPassword(user.password);
    const token = this.generateToken(user);

    user.password = hashedPassword;
    user.token = `Bearer ${token}`;
    await this.userRepository.create(user);
  }

  async updateUser(id: number, user: User): Promise<void> {
    await this.userRepository.update(id, user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async login(email: string, password: string): Promise<string | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return null;
    }

    const token = this.generateToken(user);
    return `Bearer ${token}`;
  }

  private async validateEmail(email: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  private generateToken(user: User): string {
    return jwt.sign({ email: user.email, id: user.id }, keys.jwt, {
      expiresIn: "1h",
    });
  }
}
