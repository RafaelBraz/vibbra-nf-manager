import { CategoryService } from "@/services/category/category.service";

interface IGetCategoryUseCaseParams {
  where: {
    id?: string;
    name?: string;
  };
}

export class GetCategoryUseCase {
  constructor(private category: CategoryService) {}

  async execute({ where }: IGetCategoryUseCaseParams) {
    const { id, name } = where;

    if (!id && !name) {
      throw new Error("At least one unique key is required.");
    }

    const category = await this.category.findUnique({
      id,
      name,
    });

    if (!category) {
      throw new Error("Category not found.");
    }

    return category;
  }
}
