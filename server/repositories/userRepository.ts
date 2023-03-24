import { Pool } from "pg";
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

  async findByEmail(email: string): Promise<User | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      return result.rows[0] as User | null;
    } catch (error) {
      console.error("Error in findByEmail:", error);
      return null;
    } finally {
      client.release();
    }
  }

  async create(user: User): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(
        "INSERT INTO users (name, email, password, registered_at, authorized_at, status) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          user.name,
          user.email,
          user.password,
          user.registeredAt,
          user.authorizedAt,
          user.status,
        ]
      );
    } catch (error) {
      console.error("Error in create:", error);
      throw new Error("User creation failed.");
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
