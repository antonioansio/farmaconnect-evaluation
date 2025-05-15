"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import VirtualizedTable from "./components/VirtualizedTable";
import { fetchUsers } from "./store/userSlice";
import { AppDispatch, RootState } from "./store/store";

const columns = [
  { key: "id", label: "ID", width: 80 },
  { key: "firstName", label: "Name", width: 150 },
  { key: "lastName", label: "Username", width: 150 },
  { key: "email", label: "Email", width: 250 },
  { key: "username", label: "Username", width: 150 },
  { key: "age", label: "Age", width: 80 },
  { key: "gender", label: "Gender", width: 100 },
];

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">FarmaConnect (Evaluation)</h1>
      <VirtualizedTable data={users} columns={columns} height={600} />
    </main>
  );
}
