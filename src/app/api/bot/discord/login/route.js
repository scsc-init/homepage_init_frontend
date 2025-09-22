import { handleApiRequest } from '@/app/api/apiWrapper';

export async function POST() {
  return handleApiRequest('POST', '/api/bot/discord/login');
}
