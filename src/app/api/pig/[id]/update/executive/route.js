import { handleApiRequest } from "@/app/api/apiWrapper";

export async function POST(request, { params }) {
  return handleApiRequest("POST", "/api/executive/pig/{id}/update", { params }, request);
}
