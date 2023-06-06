import { UserService } from "@/services/user/user.service";
import { hash } from "bcrypt";

interface ICreateUserUseCaseParams {
  cnpj: string;
  companyName: string;
  email: string;
  name: string;
  password: string;
  phone: string;
}

export class CreateUserUseCase {
  constructor(private userService: UserService) {}

  async execute(params: ICreateUserUseCaseParams) {
    const { cnpj, companyName, email, name, password, phone } = params;

    if (!cnpj || !companyName || !email || !name || !password || !phone) {
      throw new Error("All fields are required.");
    }

    const user = await this.userService.findMany({
      where: {
        cnpj,
        email,
      },
    });

    if (user.length > 0) {
      throw new Error("User already exists.");
    }

    const saltRounds = Number(process.env.SALT_ROUNDS);
    const hashPassord = await hash(password, saltRounds);

    const createdUser = await this.userService.create({
      cnpj,
      companyName,
      email,
      name,
      password: hashPassord,
      phone,
    });

    return createdUser;
  }
}
