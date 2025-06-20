"use client";

import React, { useState } from "react";
import UserSearchForm from "./UserSearchForm.jsx";
import UserDetailEditor from "./UserDetailEditor.jsx";
import AdminRoleEditorList from "./ExecutiveRoleEditorList";

export default function ExecutivePanelPage() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>운영진 회원 관리</h1>
      <UserSearchForm onUserFound={setSelectedUser} />
      {selectedUser && <UserDetailEditor userId={selectedUser.id} />}
      <AdminRoleEditorList />
    </div>
  );
}
