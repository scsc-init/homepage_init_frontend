// components/SigForm.jsx
import SigInputField from "./SigInputField";
import EditorSection from "./EditorSection";
import * as Button from "@/components/Button";

export default function SigForm({ register, control, onSubmit, handleSubmit }) {
  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <SigInputField label="시그 이름" placeholder="AI SIG" register={register} name="title" />
      <SigInputField label="시그 설명" placeholder="AI를 공부하는 SIG입니다" register={register} name="description" />
      <SigInputField label="외부 페이지 링크" placeholder="https://example.com/sig" register={register} name="content_src" />
      <EditorSection control={control} />
      <Button.Root type="submit">SIG 생성</Button.Root>
    </form>
  );
}
