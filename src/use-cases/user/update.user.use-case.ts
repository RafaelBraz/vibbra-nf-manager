import { InvoiceService } from "@/services/invoice/invoice.service";
import { UserService } from "@/services/user/user.service";
import { hash } from "bcrypt";

interface IUpdateUserUseCaseParams {
  where: {
    id?: string;
  };
  data: {
    cnpj: string;
    companyName: string;
    email: string;
    emailAlert: boolean;
    MEILimit: number;
    name: string;
    password: string;
    phone: string;
    smsAlert: boolean;
  };
}

export class UpdateUserUseCase {
  constructor(private user: UserService) {}

  async execute({ where, data }: IUpdateUserUseCaseParams) {
    const { id } = where;
    const {
      MEILimit,
      cnpj,
      companyName,
      email,
      emailAlert,
      name,
      password,
      phone,
      smsAlert,
    } = data;

    if (!id) {
      throw new Error("Id is required.");
    }

    const user = await this.user.findUnique({
      id,
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const saltRounds = Number(process.env.SALT_ROUNDS);
    const updatedPassword = password
      ? await hash(password, saltRounds)
      : undefined;

    const updatedUser = await this.user.update({
      where: {
        id,
      },
      data: {
        cnpj,
        companyName,
        email,
        emailAlert,
        MEILimit,
        name,
        password: updatedPassword,
        phone,
        smsAlert,
      },
    });

    return updatedUser;
  }
}
