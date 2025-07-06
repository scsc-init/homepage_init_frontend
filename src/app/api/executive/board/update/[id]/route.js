import { handleApiRequest } from "@/app/api/apiWrapper";

export async function POST(request, { params }) {
  return handleApiRequest(
    "POST",
    "/api/executive/board/update/{id}",
    { params },
    request,
  );
}
