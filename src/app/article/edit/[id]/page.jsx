import EditClient from './EditClient';

export default async function EditArticlePage({ params }) {
  const { id } = await params;
  return <EditClient articleId={id} />;
}
