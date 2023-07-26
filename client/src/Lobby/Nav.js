import { useNavigate } from "react-router";
import { useCallback } from "react";
import styles from "./Nav.module.css";

function Nav({ loginId }) {
  const navigate = useNavigate();
  const handleLogout = useCallback(() => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  }, [navigate]);

  return (
    <div className={styles.nav}>
      <div className={styles.userName}>{loginId}</div>
      <div className={styles.logoutBtn}>
        <input onClick={handleLogout} type="button" value="로그아웃" />
      </div>
    </div>
  );
}

export default Nav;
