import dynamic from "next/dynamic";
const ExecutivePanelPage = dynamic(
  () => import("../../executive_panel/ExecutivePanelPage"),
  { ssr: false },
);

export default function Page() {
  return <ExecutivePanelPage />;
}
