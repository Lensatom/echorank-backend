const statusCodes = {
  success: 200,
  created: 201,
  clientError: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  serverError: 500,
}

interface FormatResponseParams {
  res: any;
  statusCode?: number;
  type: keyof typeof statusCodes;
  message?: string;
  data?: any;
  error?: any;
}

export const formatResponse = ({
  res,
  statusCode,
  type,
  message,
  data,
  error
}: FormatResponseParams) => {
  const hasStatusCode = typeof statusCode === "number";
  const hasType = typeof type === "string";

  if (hasStatusCode === hasType) {
    throw new Error("formatResponse: Provide either 'statusCode' or 'type', not both and not neither.");
  }

  const finalStatusCode: any = hasStatusCode
    ? statusCode!
    : statusCodes[type as keyof typeof statusCodes];

  if (!finalStatusCode) {
    throw new Error(`Invalid 'type' provided. Valid types are: ${Object.keys(statusCodes).join(", ")}`);
  }

  const responsePayload: any = { message: message || type || "" };

  if (data) {
    responsePayload["data"] = data;
  }

  if (error) {
    responsePayload["error"] = error;
  }

  return res.status(finalStatusCode).json(responsePayload);
}