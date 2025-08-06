import { handleApiRequest } from "@/app/api/apiWrapper";

export async function POST(request) {
  return handleApiRequest(
    "POST",
    "/api/executive/user/standby/process/manual",
    {},
    request,
  );
}
