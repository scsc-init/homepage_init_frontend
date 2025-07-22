import { handleApiRequest } from "@/app/api/apiWrapper";

export async function GET() {
  return handleApiRequest("GET", "/api/scsc/global/status");
}
