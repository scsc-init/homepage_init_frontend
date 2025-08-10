// app/sig/edit/[id]/page.jsx
import EditSigClient from "./EditSigClient";
import "./page.css";

export default function EditSigPage({ params }) {
  const { id } = params;
  return <EditSigClient sigId={id}/>;
}
