import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { User } from "../models/user.model";
import { AppError } from "../models/appError.model";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    const users = await this.userService.getAllUsers();
    res.json(users);
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    const user = await this.userService.getUserById(id);
    res.json(user);
  }

  async createUser(req: Request, res: Response): Promise<void> {
    const user: User = req.body;

    try {
      const token = await this.userService.createUser(user);
      res.status(201).json({ token });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    const user: User = req.body;

    const updatedUser = await this.userService.updateUser(id, user);
    res.json(updatedUser);
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    await this.userService.deleteUser(id);
    res.sendStatus(204);
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      const token = await this.userService.login(email, password);
      res.json({ token });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    }
  }
}
