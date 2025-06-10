"use client";

import React from "react";
import "./header.css";
import { goToHome, goToLogin, goToMyPage } from "@/util/navigation";
import { useLoginStore } from "@/state/LoginState";
import SCSCLogo from "@@/vectors/logo.svg";
import UserIcon from "@@/vectors/user.svg";
import * as Nav from "@radix-ui/react-navigation-menu";
import "@/components/FloatingCard.css";

const LogoIcon = ({ ...props }) => {
  return (
    <button className="unset" onClick={() => goToHome()}>
      <SCSCLogo {...props} />
    </button>
  );
};

const HeaderMenu = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  (props, ref) => {
    return <div ref={ref} id="HeaderMenu" {...props}></div>;
  });

export function HeaderNavigation() {
  return (
    <Nav.Root id="HeaderMenu">
      <Nav.List id="HeaderMenuList">
        <Nav.Item className="HeaderMenuItem" key="소개">
          <Nav.Trigger>소개</Nav.Trigger>
          <Nav.Content className="HeaderMenuContent">
            <ul>
              <li><button className="unset" onClick={() => window.location.href = "/intro"}>동아리 소개</button></li>
              <li><button className="unset">운영진 소개</button></li>
              <li><button className="unset">개발자 크레딧</button></li>
            </ul>
          </Nav.Content>
        </Nav.Item>
        <Nav.Item className="HeaderMenuItem" key="게시판">
          <Nav.Trigger>게시판</Nav.Trigger>
          <Nav.Content className="HeaderMenuContent">
            <ul>
              <li><button className="unset">자유 게시판</button></li>
              <li><button className="unset">공지사항</button></li>
            </ul>
          </Nav.Content>
        </Nav.Item>
        <Nav.Item className="HeaderMenuItem" key="시그">
          <Nav.Trigger>시그</Nav.Trigger>
          <Nav.Content className="HeaderMenuContent">
            <ul>
              <li>
                <button className="unset" onClick={() => window.location.href = "/sig"}>
                  시그 목록
                </button>
              </li>
              <li>
                <button className="unset">피그 목록</button>
              </li>
            </ul>
          </Nav.Content>
        </Nav.Item>
      </Nav.List>
      <div id="HeaderMenuViewportContainer">
        <Nav.Viewport className="C_FloatingCard" id="HeaderMenuViewport" />
      </div>
    </Nav.Root>
  );
}

export default function Header() {
  const loginStore = useLoginStore();

  return (
    <div id="HeaderContainer">
      <div id="Header">
        <LogoIcon id="HeaderLogo" />
        <HeaderNavigation />
        <button id="HeaderUser" className="unset">
          {loginStore.login_token ? (
            <span id="HeaderUserName">
              {loginStore.name}
            </span>
          ) : (
            <div id="HeaderUserLogin" onClick={() => goToLogin()}>
              로그인
            </div>
          )}
          <UserIcon className="HeaderUserIcon" onClick={() => goToMyPage()} />
        </button>
      </div>
    </div>
  );
}
