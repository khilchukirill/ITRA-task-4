import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { User } from "../models/user.model";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    const users = await this.userService.getAllUsers();
    res.status(200).json(users);
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    const user = await this.userService.getUserById(id);
    res.status(200).json(user);
  }

  async createUser(req: Request, res: Response): Promise<void> {
    const user: User = req.body;
    try {
      await this.userService.createUser(user);
      res.status(201).json(user);
    } catch (error: unknown) {
      const errorMessage = (error as Error).message;
      if (errorMessage === "User with this email already exists") {
        res.status(409).json({ message: errorMessage });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    const user: User = req.body;
    const updatedUser = await this.userService.updateUser(id, user);
    res.status(200).json(updatedUser);
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    await this.userService.deleteUser(id);
    res.status(204).json();
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const token = await this.userService.login(email, password);
    if (token) {
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  }
}
