import { UserService } from "@/services/user/user.service";

interface IGetUserUseCaseParams {
  where: {
    id?: string;
    cnpj?: number;
    email?: string;
  };
}

export class GetUserUseCase {
  constructor(private userService: UserService) {}

  async execute({ where }: IGetUserUseCaseParams) {
    const { cnpj, email, id } = where;

    if (!cnpj && !email && !id) {
      throw new Error("At least one unique key is required.");
    }

    const user = await this.userService.findUnique({
      id,
      cnpj,
      email,
    });

    if (!user) {
      throw new Error("User not found.");
    }

    return user;
  }
}
