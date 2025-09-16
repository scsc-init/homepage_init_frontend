// src/app/api/article/delete/[id]/route.js
import { handleApiRequest } from "@/app/api/apiWrapper";

export async function POST(_request, { params }) {
  return handleApiRequest("POST", "/api/article/delete/{id}", { params });
}
