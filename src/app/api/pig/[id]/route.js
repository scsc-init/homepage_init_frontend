import { handleApiRequest } from "@/app/api/apiWrapper";

export async function GET(request, { params }) {
  return handleApiRequest("GET", "/api/pig/{id}", { params });
}
