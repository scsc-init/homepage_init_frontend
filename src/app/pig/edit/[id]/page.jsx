// app/pig/edit/[id]/page.jsx
import EditPigClient from "./EditPigClient";
import "./page.css";

export const metadata = { title: "PIG" };
export default function EditPigPage({ params }) {
  const { id } = params;
  return <EditPigClient pigId={id} />;
}
