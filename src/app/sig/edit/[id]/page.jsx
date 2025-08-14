// app/sig/edit/[id]/page.jsx
import EditSigClient from "./EditSigClient";
import "./page.css";

export const metadata = { title: "SIG" };
export default function EditSigPage({ params }) {
  const { id } = params;
  return <EditSigClient sigId={id} />;
}
