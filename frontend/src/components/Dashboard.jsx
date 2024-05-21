import React from "react";

export default function Dashboard() {
  return (
    <div className="shadow-sm border-b-2">
      <TopBar />
    </div>
  );
}

function TopBar() {
  return (
    <>
      <div className="flex justify-between p-1">
        <h1 className="mt-2 p-2 text-2xl">PayTm App</h1>
        <User />
      </div>
    </>
  );
}

function User() {
  return (
    <>
      <div className="flex gap-x-4 mt-2 p-2">
        <span>Hello,User</span>
        <img className="w-8 h-8" src="user.png" alt="" />
      </div>
    </>
  );
}
