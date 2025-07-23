import { handleApiRequest } from "@/app/api/apiWrapper";

export async function POST(request, { params }) {
  return handleApiRequest("POST", "/api/comment/delete/{id}", { params });
}
