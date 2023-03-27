import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { UserRepository } from "../repositories/userRepository";
import { AppError } from "../models/appError.model";
const keys = require("../config/keys");
const moment = require("moment");

export class UserService {
  private readonly saltRounds = 10;
  private readonly now = moment().format("DD.MM.YYYY, h:mm:ss");

  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async createUser(user: User): Promise<string> {
    try {
      await this.validateEmail(user.email);

      const hashedPassword = await this.hashPassword(user.password);

      const newUser = {
        ...user,
        registeredAt: this.now,
        authorizedAt: this.now,
        status: "Active",
        password: hashedPassword,
      };

      await this.userRepository.create(newUser);
      const createdUser = await this.userRepository.findByEmail(newUser.email);
      if (!createdUser) {
        throw new AppError("Failed to create user", 500);
      }

      const token = this.generateToken(createdUser);
      return `Bearer ${token}`;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to create user", 500);
    }
  }

  async updateUser(id: number, user: User): Promise<void> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new AppError("User not found", 404);
    }
    await this.userRepository.update(id, user);
  }

  async deleteUser(id: number): Promise<void> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new AppError("User not found", 404);
    }
    await this.userRepository.delete(id);
  }

  async login(email: string, password: string): Promise<string> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new AppError("Invalid email or password", 401);
      }

      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        throw new AppError("Invalid email or password", 401);
      }

      if (user.status === "Blocked") {
        throw new AppError("User is blocked", 403);
      }

      user.authorizedAt = this.now;
      if (user.id) {
        await this.userRepository.update(user.id, user);
      }

      const token = this.generateToken(user);
      return `Bearer ${token}`;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Invalid email or password", 401);
    }
  }

  private async validateEmail(email: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError("User with this email already exists", 409);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  private generateToken(user: User): string {
    return jwt.sign({ email: user.email, id: user.id }, keys.jwt, {
      expiresIn: "1h",
    });
  }
}
