import { CategoryService } from "@/services/category/category.service";

interface IGetManyCategoryUseCaseParams {
  where: {
    userId?: string;
    archieved?: boolean;
  };
}

export class GetManyCategoryUseCase {
  constructor(private category: CategoryService) {}

  async execute({ where }: IGetManyCategoryUseCaseParams) {
    const { archieved, userId } = where;

    const getAll = !userId && !archieved;

    if (getAll) {
      const categories = await this.category.findMany({});
      return categories;
    }

    const categories = await this.category.findMany({
      where: {
        categoryOfId: userId,
        archieved,
      },
    });
    return categories;
  }
}
