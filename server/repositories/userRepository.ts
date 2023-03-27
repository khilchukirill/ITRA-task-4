import { Pool } from "pg";
import { User } from "../models/user.model";

export class UserRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async findAll(): Promise<User[]> {
    const client = await this.pool.connect();

    try {
      const result = await client.query("SELECT * FROM users");
      return result.rows as User[];
    } finally {
      client.release();
    }
  }

  public async findById(id: number): Promise<User | null> {
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

  public async findByEmail(email: string): Promise<User | null> {
    const client = await this.pool.connect();

    try {
      const result = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      return result.rows[0] as User | null;
    } catch (error) {
      console.error(`Error in findByEmail: ${error}`);
      return null;
    } finally {
      client.release();
    }
  }

  public async create(user: User): Promise<void> {
    const client = await this.pool.connect();

    try {
      const query =
        "INSERT INTO users (name, email, password, registered_at, authorized_at, status) VALUES ($1, $2, $3, $4, $5, $6)";
      const values = [
        user.name,
        user.email,
        user.password,
        user.registeredAt,
        user.authorizedAt,
        user.status,
      ];

      await client.query(query, values);
    } catch (error) {
      console.error(`Error in create: ${error}`);
      throw new Error("User creation failed.");
    } finally {
      client.release();
    }
  }

  public async update(id: number, user: User): Promise<void> {
    const client = await this.pool.connect();

    try {
      let query;
      let values;
      if (user.authorizedAt) {
        query =
          "UPDATE users SET authorized_at = $1, status = $2 WHERE id = $3";
        values = [user.authorizedAt, user.status, id];
      } else {
        query = "UPDATE users SET status = $1 WHERE id = $2";
        values = [user.status, id];
      }
      await client.query(query, values);
    } finally {
      client.release();
    }
  }

  public async delete(id: number): Promise<void> {
    const client = await this.pool.connect();

    try {
      const query = "DELETE FROM users WHERE id = $1";

      await client.query(query, [id]);
    } finally {
      client.release();
    }
  }
}
