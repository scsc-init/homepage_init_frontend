"use client";

import NextImageWrapper from "../image/NextImageWrapper";
import Markdown from "marked-react";

import "./Text.css";

interface SimpleSimjiType {
  content: string;
}

export default function Text({ content }: SimpleSimjiType) {
  return <Markdown>{content}</Markdown>;
}
