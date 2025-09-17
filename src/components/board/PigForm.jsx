// component를 잘못 설계해서, sig로 재활용하는 양상이 되어버렸습니다. 배포 이전에는 수정하겠습니다.
import SigInputField from "./SigInputField";
import * as Button from "@/components/Button.jsx";
import ToggleSwitch from "@/components/ToggleSwitch.jsx";
import { Controller } from "react-hook-form";

export default function PigForm({
  register,
  control,
  handleSubmit,
  onSubmit,
  Editor,
  editorKey,
  isCreate
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
              key={editorKey}
              markdown={typeof field.value === "string" ? field.value : ""}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {isCreate ? null : <div>
        <label className="block mb-2 font-semibold">다음 학기에 연장 신청</label>
        <div>
          <Controller
            name="should_extend"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <ToggleSwitch checked={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      </div>}

      <Button.Root type="submit">{isCreate ? 'PIG 생성' : 'PIG 수정'}</Button.Root>
    </form>
  );
}
