'use client';
import React, { useState } from 'react';

export default function MajorList({ majors: majorsDefault }) {
  const [majors, setMajors] = useState(majorsDefault ?? []);
  const [newMajor, setNewMajor] = useState({ college: '', major_name: '' });

  const updateMajorField = (id, field, value) => {
    setMajors((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const saveMajor = async (major) => {
    const res = await fetch(`/api/executive/major/update/${major.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(major),
    });
    if (res.status === 204) alert('저장 완료');
    else alert('저장 실패: ' + res.status);
  };

  const deleteMajor = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/executive/major/delete/${id}`, {
      method: 'POST',
    });
    if (res.status === 204) {
      alert('삭제 완료');
      setMajors((prev) => prev.filter((m) => m.id !== id));
    } else alert('삭제 실패: ' + res.status);
  };

  const createMajor = async () => {
    const res = await fetch(`/api/executive/major/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMajor),
    });
    if (res.status === 201) {
      setNewMajor({ college: '', major_name: '' });
      alert('추가 완료');
    } else alert('추가 실패: ' + res.status);
  };

  return (
    <div>
      <h2>전공 목록</h2>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th className="adm-th" style={{ width: '10%' }}>
                ID
              </th>
              <th className="adm-th" style={{ width: '30%' }}>
                대학
              </th>
              <th className="adm-th" style={{ width: '45%' }}>
                전공명
              </th>
              <th className="adm-th" style={{ width: '15%' }}>
                작업
              </th>
            </tr>
          </thead>
          <tbody>
            {majors.map((major) => (
              <tr key={major.id}>
                <td className="adm-td">{major.id}</td>
                <td className="adm-td">
                  <input
                    className="adm-input"
                    value={major.college}
                    onChange={(e) => updateMajorField(major.id, 'college', e.target.value)}
                  />
                </td>
                <td className="adm-td">
                  <input
                    className="adm-input"
                    value={major.major_name}
                    onChange={(e) => updateMajorField(major.id, 'major_name', e.target.value)}
                  />
                </td>
                <td className="adm-td">
                  <div className="adm-flex">
                    <button className="adm-button" onClick={() => saveMajor(major)}>
                      저장
                    </button>
                    <button
                      className="adm-button outline"
                      onClick={() => deleteMajor(major.id)}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <td className="adm-td"></td>
              <td className="adm-td">
                <input
                  className="adm-input"
                  placeholder="대학명"
                  value={newMajor.college}
                  onChange={(e) =>
                    setNewMajor((prev) => ({
                      ...prev,
                      college: e.target.value,
                    }))
                  }
                />
              </td>
              <td className="adm-td">
                <input
                  className="adm-input"
                  placeholder="전공명"
                  value={newMajor.major_name}
                  onChange={(e) =>
                    setNewMajor((prev) => ({
                      ...prev,
                      major_name: e.target.value,
                    }))
                  }
                />
              </td>
              <td className="adm-td">
                <button className="adm-button" onClick={createMajor}>
                  추가
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
