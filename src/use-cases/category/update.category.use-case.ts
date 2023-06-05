import { CategoryService } from "@/services/category/category.service";

interface IUpdateCategoryUseCaseParams {
  where: {
    id?: string;
  };
  data: {
    name?: string;
    description?: string;
    archieved?: boolean;
  };
}

export class UpdateCategoryUseCase {
  constructor(private category: CategoryService) {}

  async execute({ where, data }: IUpdateCategoryUseCaseParams) {
    const { id } = where;
    const { archieved, description, name } = data;

    if (!id) {
      throw new Error("Id is required.");
    }

    const category = await this.category.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        archieved,
      },
    });

    return category;
  }
}
