import { handleApiRequest } from "@/app/api/apiWrapper";

export async function POST(request, { params }) {
  return handleApiRequest("POST", "/api/sig/{id}/member/join", { params });
}
