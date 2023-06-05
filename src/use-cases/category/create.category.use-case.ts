import { CategoryService } from "@/services/category/category.service";

interface ICreateCategoryUseCaseParams {
  data: {
    name: string;
    description: string;
    userId: string;
  };
}

export class CreateCategoryUseCase {
  constructor(private category: CategoryService) {}

  async execute({ data }: ICreateCategoryUseCaseParams) {
    const { description, name, userId } = data;

    if (!name) {
      throw new Error("All fields are required.");
    }

    const category = await this.category.findMany({
      where: {
        name,
      },
    });

    if (category.length > 0) {
      throw new Error("Category with this name already exists.");
    }

    const createdCategory = await this.category.create({
      name,
      description,
      categoryOf: {
        connect: {
          id: userId,
        },
      },
    });

    return createdCategory;
  }
}
