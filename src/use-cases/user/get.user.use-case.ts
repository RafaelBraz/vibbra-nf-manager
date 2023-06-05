import { UserService } from "@/services/user/user.service";

interface IGetUserUseCaseParams {
  where: {
    id?: string;
    cnpj?: string;
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

    return user;
  }
}
