import "./adminPanel.scss";
import Button from "react-bootstrap/Button";
import AdminTable from "../../components/table/adminTable";
import { useNavigate } from "react-router-dom";

export function AdminPanel() {
  const headerTitle: string = "Users";
  const logoutBtn: string = "logout";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/signIn");
  };

  return (
    <div>
      <header className="header">
        <div className="header__title">{headerTitle}</div>
        <Button variant="outline-primary" onClick={handleLogout}>
          {logoutBtn}
        </Button>{" "}
      </header>
      <AdminTable />
    </div>
  );
}
