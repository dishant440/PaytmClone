import React, { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom"

export default function Dashboard() {
  const [username, setUsername] = useState(null);
  const [balance, setBalance] = useState(null);
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/user/me")
      .then((response) => {
        setUsername(response.data.name);
        setBalance(response.data.balance);
      })
      .catch((error) => {
        console.error("There was an error fetching the users!", error);
      });
  }, []);
  return (
    <div>
      <TopBar username={username} />
      <Balance balance={balance} />
      <UserRenderer />
    </div>
  );
}

function TopBar({ username }) {
  return (
    <>
      <div className="flex justify-between p-1 shadow-sm border-b-2 mb-2">
        <h1 className="mt-2 p-2 text-2xl font-bold">PayTm App</h1>
        <User username={username} />
      </div>
    </>
  );
}

function Balance(props) {
  return (
    <div className="text-lg font-bold ml-2 mt-5">
      <h2>Your balance ${props.balance}</h2>
    </div>
  );
}

function UserComponents() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([]);
  

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/user/bulk")
      .then((response) => {
        setUsers(response.data.users);
        console.log(response.data.users);
      })
      .catch((error) => {
        console.error("There was an error fetching the users!", error);
      });
  }, []);

  return (
    <>
      {users &&
        users.map((user, index) => (
          <div key={index} className="flex justify-between p-2 mt-3">
            <div className="flex gap-x-2">
              <img
                className="w-8 h-8"
                src="user.png"
                alt={`${user.firstname}'s avatar`}
              />
              <span className="font-bold">{user.firstname}</span>
            </div>
            <div>
              <button className="bg-black text-white p-2 rounded text-sm"
                onClick={(e)=>{
                  navigate("/sendmoney?Id="+user._id+"&name="+user.firstname)
                }}
              >
                Send Money
              </button>
            </div>
          </div>
        ))}
    </>
  );
}

function UserRenderer() {
  return (
    <>
      <div>
        <h1 className="mt-8 ml-2 text-md font-bold">Users</h1>
        <input
          className="mt-5 ml-2 border-2 w-full p-2"
          type="text"
          placeholder="Search Users"
        />
      </div>
      <div>
        <UserComponents />
      </div>
    </>
  );
}

function User(props) {
  return (
    <>
      <div className="flex gap-x-4 mt-2 p-2 font-bold">
        <span>Hello, {props.username}</span>
        <img className="w-8 h-8" src="user.png" alt="" />
      </div>
    </>
  );
}
