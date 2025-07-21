import { handleApiRequest } from "@/app/api/apiWrapper";

export async function GET({ params }) {
  return handleApiRequest("GET", "/api/user/{id}", { params });
}
