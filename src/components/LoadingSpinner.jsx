"use client";

import { useEffect, useState } from "react";

const codes = [
  `#include <stdio.h>
int main(void){
  print("Hello, world!")
}`,
  `#include <iostream>
int main(void){
  std::out << "Hello, world!";
}`,
  `using System;
class Hello
{
  static void Main()
  {
    Console.Write("Hello, world!");
  }
}`,
  `print("Hello, world!")
print("Hello, SCSC!")
name = input("이름을 입력하세요: ")
print(f"안녕하세요, {name}님!")`,
];

export default function LoadingSpinner() {
  const [sampleCode] = useState(() => {
    const random_index = Math.floor(Math.random() * codes.length);
    return codes[random_index];
  });

  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      setDisplayed((prev) => {
        const next = sampleCode.slice(0, i++);
        if (i > sampleCode.length) clearInterval(typing);
        return next;
      });
    }, 30);

    const cursorBlink = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(typing);
      clearInterval(cursorBlink);
    };
  }, [sampleCode]);

  return (
    <div className="LoadingCodeWrapper">
      <pre className="LoadingCodeBlock">
        {displayed}
        <span className="Cursor">{showCursor ? "|" : " "}</span>
      </pre>
      <p className="LoadingText">코드 컴파일 중...</p>
    </div>
  );
}
