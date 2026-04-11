import EditClient from './EditClient';
import { use } from 'react';

export default function EditArticlePage({ params }) {
  const { id } = use(params);
  return <EditClient articleId={id} />;
}
