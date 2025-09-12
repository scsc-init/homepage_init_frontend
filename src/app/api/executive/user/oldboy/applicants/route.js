import { handleApiRequest } from "@/app/api/apiWrapper";

export async function GET() {
  return handleApiRequest("GET", "/api/executive/user/oldboy/applicants");
}
