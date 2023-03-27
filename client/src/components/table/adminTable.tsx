import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import { TableButton, UserModel } from "../models";
import "./table.scss";
import Button from "react-bootstrap/Button";

function AdminTable() {
  const tableTitles = [
    "ID",
    "Name",
    "Email",
    "Registered",
    "Authorized",
    "Status",
  ];
  const buttons = [
    new TableButton("block", "primary", "Block"),
    new TableButton("activate", "success", "Unblock"),
    new TableButton("delete", "danger", "Delete"),
  ];
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserModel[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token not found");
    return token;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getToken();

        const response = await fetch("http://localhost:4000/users/", {
          headers: { Authorization: token },
        });

        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(`Error fetching users: ${error}`);
      }
    };

    fetchUsers();
  }, []);

  const toggleRowSelection = (id: number) => {
    const isSelected = selectedRows.includes(id);
    setSelectedRows((prevSelectedRows) =>
      isSelected
        ? prevSelectedRows.filter((rowId) => rowId !== id)
        : [...prevSelectedRows, id]
    );
  };

  const toggleAllRowsSelection = () => {
    const isAllSelected = selectedRows.length === users.length;
    setSelectedRows(isAllSelected ? [] : users.map((user) => user.id));
  };

  const handleAction = async (ids: number[], action: string) => {
    const url = "http://localhost:4000/users/";

    try {
      await Promise.all(
        ids.map(async (id) => {
          const headers = {
            Authorization: getToken(),
            "Content-Type": "application/json",
          };
          const body = {
            status: action === "block" ? "Blocked" : "Active",
          };
          const method = action === "delete" ? "DELETE" : "PUT";

          const response = await fetch(url + id, {
            method,
            headers,
            body: JSON.stringify(body),
          });

          if (!response.ok) throw new Error(`Failed to ${action} user`);

          if (action === "delete") {
            setUsers((users) => users.filter((user) => user.id !== id));
          } else {
            setUsers((users) =>
              users.map((user) =>
                user.id === id ? { ...user, status: body.status } : user
              )
            );
          }

          if (
            id === parseInt(localStorage.getItem("userId") || "") &&
            (action === "delete" || action === "block")
          ) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            navigate("/signIn");
          }
        })
      );
    } catch (error) {
      console.error(`Error ${action}ing user`, error);
    }
  };

  const renderTableHead = () => (
    <thead>
      <tr>
        <th>
          <input
            type="checkbox"
            checked={selectedRows.length === users.length}
            onChange={toggleAllRowsSelection}
          />
        </th>
        {tableTitles.map((tableTitle, index) => (
          <th key={index}>{tableTitle}</th>
        ))}
      </tr>
    </thead>
  );

  const renderTableBody = () => (
    <tbody>
      {users
        .sort((a, b) => a.id - b.id)
        .map((user) => (
          <tr key={user.id}>
            <td>
              <input
                type="checkbox"
                checked={selectedRows.includes(user.id)}
                onChange={() => toggleRowSelection(user.id)}
              />
            </td>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.registered_at}</td>
            <td>{user.authorized_at}</td>
            <td>{user.status}</td>
          </tr>
        ))}
    </tbody>
  );

  return (
    <div>
      <div className="btns__wrapper">
        {buttons.map((button, index) => (
          <Button
            key={index}
            variant={button.variant}
            onClick={() => handleAction(selectedRows, button.action)}
          >
            {button.label}
          </Button>
        ))}
      </div>
      <Table striped bordered hover>
        {renderTableHead()}
        {renderTableBody()}
      </Table>
    </div>
  );
}

export default AdminTable;
