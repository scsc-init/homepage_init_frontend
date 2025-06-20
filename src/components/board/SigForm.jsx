// components/sig/SigForm.jsx
import SigInputField from "./SigInputField";
import * as Button from "@/components/Button.jsx";
import { Controller } from "react-hook-form";

export default function SigForm({
  register,
  control,
  handleSubmit,
  onSubmit,
  Editor, // forwardRef 없어도 됨
}) {
  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <SigInputField
        label="시그 이름"
        placeholder="AI SIG"
        register={register}
        name="title"
      />
      <SigInputField
        label="시그 설명"
        placeholder="AI를 공부하는 SIG입니다"
        register={register}
        name="description"
      />

      <div>
        <label className="block mb-2 font-semibold">상세 소개</label>
        <Controller
          name="editor"
          control={control}
          render={({ field }) => (
            <Editor
              markdown={typeof field.value === "string" ? field.value : ""}
              onChange={field.onChange}
              // ❌ ref 완전히 제거됨
            />
          )}
        />
      </div>

      <Button.Root type="submit">SIG 생성</Button.Root>
    </form>
  );
}
