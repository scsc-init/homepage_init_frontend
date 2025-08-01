// component를 잘못 설계해서, sig로 재활용하는 양상이 되어버렸습니다. 배포 이전에는 수정하겠습니다.
import SigInputField from "./SigInputField";
import * as Button from "@/components/Button.jsx";
import { Controller } from "react-hook-form";

export default function PigForm({
  register,
  control,
  handleSubmit,
  onSubmit,
  Editor, // forwardRef 없어도 됨
}) {
  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <SigInputField
        label="피그 이름"
        placeholder="INIT PIG"
        register={register}
        name="title"
      />
      <SigInputField
        label="피그 설명"
        placeholder="홈페이지를 관리하는 PIG입니다"
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
            />
          )}
        />
      </div>

      <Button.Root type="submit">PIG 생성</Button.Root>
    </form>
  );
}
