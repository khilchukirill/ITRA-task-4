import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { UserModel } from "../models";
import "./table.scss";
import Button from "react-bootstrap/Button";

const AdminTable = () => {
  const tableTitles: Array<string> = [
    "ID",
    "Name",
    "Email",
    "Registered",
    "Authorised",
    "Status",
  ];

  const [users, setUsers] = useState<UserModel[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

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

  const handleAction = async (method: string, status?: string) => {
    try {
      const token = getToken();
      const promises = selectedRows.map((id) => {
        const user = users.find((user) => user.id === id);
        if (!user) throw new Error("user not found");
        return fetch(`http://localhost:4000/users/${id}`, {
          method,
          headers: { Authorization: token },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            status,
          }),
        });
      });
      await Promise.all(promises);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          selectedRows.includes(user.id) ? { ...user, status: status } : user
        )
      );
      setSelectedRows([]);
    } catch (error) {
      console.error(`Error ${method.toLowerCase()}ing users: ${error}`);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      const token = getToken();
      await fetch(`http://localhost:4000/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      setSelectedRows([]);
    } catch (error) {
      console.error(`Error deleting user: ${error}`);
    }
  };

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    return token;
  };

  const handleDelete = () => {
    selectedRows.forEach((id) => handleDeleteUser(id));
  };

  const handleBlock = () => handleAction("PUT", "Blocked");
  const handleUnblock = () => handleAction("PUT", "Active");

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
      {users.map((user) => (
        <tr key={user.id} onClick={() => toggleRowSelection(user.id)}>
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
          <td>{user.authorised_at}</td>
          <td>{user.status}</td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div>
      <div className="btns__wrapper">
        <Button variant="primary" onClick={handleBlock}>
          Block
        </Button>
        <Button variant="success" onClick={handleUnblock}>
          Unblock
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </div>
      <Table striped bordered hover>
        {renderTableHead()}
        {renderTableBody()}
      </Table>
    </div>
  );
};

export default AdminTable;
