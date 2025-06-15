"use client";

import React from "react";
import * as Input from "@/components/Input";
import * as Select from "@/components/Select";
import * as Button from "@/components/Button";
import Divider from "@/components/Divider";
import "./page.css";
import dynamic from "next/dynamic";

import { type MDXEditorMethods, type MDXEditorProps } from "@mdxeditor/editor";
import { goToSigList } from "@/util/navigation";
import { Controller, useForm } from "react-hook-form";
import { useLoginStore } from "@/state/LoginState";
import { useRouter } from "next/navigation";

const Editor = dynamic(() => import("./MDXEditor"), {
  ssr: false,
});

const ForwardRefEditor = React.forwardRef<MDXEditorMethods, MDXEditorProps>(
  (props, ref) => <Editor {...props} editorRef={ref} />,
);

ForwardRefEditor.displayName = "ForwardRefEditor";

interface FormInputs {
  name: string;
  short_description: string;
  description: string;
  type: string;
  ftf: string;
}

export default function Page() {
  const router = useRouter();
  const loginStore = useLoginStore();

  const { register, control, handleSubmit } = useForm<FormInputs>({
    defaultValues: {
      name: "",
      short_description: "",
      description: "여기에 시그 설명을 작성해주세요",
      type: "",
      ftf: "",
    },
  });

  const onSubmit = async (data: FormInputs) => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_SERVER_URL + "/sig/create",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: {
            login_token: loginStore.login_token,
          },
          sig: {
            name: data.name,
            short_description: data.short_description,
            description: data.description,
            type_: data.type,
            ftf: data.ftf == "FTF" ? true : false,
          },
        }),
      },
    );

    if (response.status === 200) {
      alert("시그가 성공적으로 생성되었습니다.");
      goToSigList();
    } else if (
      response.status === 400 &&
      (await response.json()).detail === "invalid_login_token"
    ) {
      loginStore.logout();
      router.push("/login");
    } else {
      alert("시그 생성에 실패했습니다.");
    }
  };

  const onInvalid = () => {
    alert("모든 항목이 기입되지 않았습니다.");
  };

  return (
    <div id="DetailsContainer">
      <div id="Details">
        <div>
          <Input.Root>
            <Input.Label>시그 이름</Input.Label>
            <Input.Input
              id="SigTitle"
              placeholder="Basic C++"
              {...register("name")}
            />
          </Input.Root>
          <Input.Root>
            <Input.Label>시그 간단한 설명</Input.Label>
            <Input.Input
              id="SigShortDesc"
              placeholder="C++ 기초 시그입니다!"
              {...register("short_description")}
            />
          </Input.Root>
          <Divider />
          <div id="SigOptions">
            <Controller
              name="type"
              control={control}
              rules={{ required: true }}
              render={({ field }) => {
                const { ref, ...restField } = field;
                return (
                  <Select.Root
                    onValueChange={restField.onChange}
                    {...restField}
                  >
                    <Select.Trigger id="SigType" aria-label="Sig Type">
                      <Select.Value placeholder="운영 방식" />
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Group key="SIG">
                        <Select.GroupLabel>SIG</Select.GroupLabel>
                        <Select.Item key="LeadSIG" value="LeadSIG">
                          리드스터디
                        </Select.Item>
                        <Select.Item key="GroupSIG" value="GroupSIG">
                          그룹스터디
                        </Select.Item>
                      </Select.Group>
                      <Select.Separator />
                      <Select.Group key="PIG">
                        <Select.GroupLabel>PIG </Select.GroupLabel>
                        <Select.Item key="LeadPIG" value="LeadPIG">
                          리드프로젝트
                        </Select.Item>
                        <Select.Item key="GroupPIG" value="GroupPIG">
                          그룹프로젝트
                        </Select.Item>
                      </Select.Group>
                    </Select.Portal>
                  </Select.Root>
                );
              }}
            />
            <Controller
              name="ftf"
              control={control}
              rules={{ required: true }}
              render={({ field }) => {
                const { ref, ...restField } = field;
                return (
                  <Select.Root
                    onValueChange={restField.onChange}
                    {...restField}
                  >
                    <Select.Trigger id="SigMeetType" aria-label="Sig Type">
                      <Select.Value placeholder="대면 / 비대면" />
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Item key="FTF" value="FTF">
                        대면
                      </Select.Item>
                      <Select.Item key="NFTF" value="NFTF">
                        비대면
                      </Select.Item>
                    </Select.Portal>
                  </Select.Root>
                );
              }}
            />
          </div>
        </div>
        <Controller
          name="description"
          control={control}
          rules={{ required: true }}
          render={({ field }) => {
            const { ref, ...restField } = field;
            return (
              <ForwardRefEditor markdown={restField.value} {...restField} />
            );
          }}
        />
        <Divider />
        <div id="DetailsButtons">
          <Button.Root onClick={handleSubmit(onSubmit, onInvalid)}>
            작성하기
          </Button.Root>
          <Button.Root onClick={() => goToSigList()}>뒤로가기</Button.Root>
        </div>
      </div>
    </div>
  );
}
