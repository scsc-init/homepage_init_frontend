// app/pig/edit/[id]/page.jsx
import EditPigClient from "./EditPigClient";
import "./page.css";

export default function EditPigPage({ params }) {
  const { id } = params;
  return <EditPigClient pigId={id}/>;
}
