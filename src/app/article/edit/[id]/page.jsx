import EditClient from './EditClient';

export default function EditArticlePage({ params }) {
  return <EditClient articleId={params.id} />;
}
