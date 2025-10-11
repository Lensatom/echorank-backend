
interface IPaginationHelper {
  Model: any;
  page?: number;
  limit?: number;
  selectFields?: string;
  query?: object;
}

export const paginationHelper = async ({
  Model,
  page = 1,
  limit = 10,
  selectFields,
  query = {}
} : IPaginationHelper) => {

  const totalData = await Model.countDocuments(query)
  const totalPages = Math.ceil(totalData / limit)
  const skip = (page - 1) * limit

  const data = await Model.find(query)
    .select(selectFields || '')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalData,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
}