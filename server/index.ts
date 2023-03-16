// @ts-ignore
import express from 'express';
import { UserController } from './controllers/UserController';
import { UserService} from "./services/user.service";
import { UserRepository } from "./repositories/userRepository";
import { Pool } from 'pg';


const app = express();
const pool = new Pool({
    connectionString: 'postgres://khilchukirill:DTPe9FVqB5v0BYsyzbKo9RMA7k8jp3GP@dpg-cg8vcl9mbg58573rkq8g-a.frankfurt-postgres.render.com/commondb?ssl=true',
});
const port = 4200;

const userRepository = new UserRepository(pool);
const userService = new UserService(userRepository);
const userController = new UserController(userService);


app.use(express.json());

app.get('/users', userController.getAllUsers.bind(userController));
app.get('/users/:id', userController.getUserById.bind(userController));
app.post('/users', userController.createUser.bind(userController));
app.put('/users/:id', userController.updateUser.bind(userController));
app.delete('/users/:id', userController.deleteUser.bind(userController));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
