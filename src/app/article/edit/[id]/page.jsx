import EditClient from "./EditClient";

export default async function EditArticlePage({ params }) {
  return <EditClient articleId={params.id} />;
}
