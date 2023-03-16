import { Pool } from "pg";
import * as bcrypt from "bcrypt";
import { User } from "../models/user.model";

export class UserRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findAll(): Promise<User[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query("SELECT * FROM users");
      return result.rows as User[];
    } finally {
      client.release();
    }
  }

  async findById(id: number): Promise<User | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query("SELECT * FROM users WHERE id = $1", [
        id,
      ]);
      return result.rows[0] as User | null;
    } finally {
      client.release();
    }
  }

  async findByEmailAndPassword(
    email: string,
    password: string
  ): Promise<User | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      const user = result.rows[0] as User | null;
      if (user && (await bcrypt.compare(password, user.password))) {
        return user;
      }
      return null;
    } catch (error) {
      console.error("Error in findByEmailAndPassword:", error);
      return null;
    } finally {
      client.release();
    }
  }

  async create(user: User): Promise<void> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    const client = await this.pool.connect();
    try {
      await client.query(
        "INSERT INTO users (name, email, password, registered_at, authorized_at, status) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          user.name,
          user.email,
          hashedPassword,
          user.registeredAt,
          user.authorizedAt,
          user.status,
        ]
      );
    } finally {
      client.release();
    }
  }

  async update(id: number, user: User): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(
        "UPDATE users SET name = $1, email = $2, password = $3, registered_at = $4, authorized_at = $5, status = $6 WHERE id = $7",
        [
          user.name,
          user.email,
          user.password,
          user.registeredAt,
          user.authorizedAt,
          user.status,
          id,
        ]
      );
    } finally {
      client.release();
    }
  }

  async delete(id: number): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query("DELETE FROM users WHERE id = $1", [id]);
    } finally {
      client.release();
    }
  }
}
