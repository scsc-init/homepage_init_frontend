import EditClient from './EditClient';

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditClient articleId={id} />;
}
