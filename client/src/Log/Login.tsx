/* Login.tsx */
import React, { useState, useEffect } from "react";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login: React.FC = () => {
  const [loginId, setLoginId] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleLogIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId.trim && !loginPassword.trim) {
      alert("회원정보를 입력해주세요.");
      return;
    } else if (!loginId.trim) {
      alert("아이디를 입력해주세요.");
      return;
    } else if (!loginPassword.trim) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/login`,
        {
          loginId,
          loginPassword,
        }
      );
      console.log(response.data);

      localStorage.setItem("jwtToken", response.data);
      alert("로그인 성공");
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data}`;
      navigate("/Lobby");
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인 실패");
    }
  };
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !password || !confirmPassword) {
      alert("모든 정보를 입력해주세요.");
      return;
    } else if (password !== confirmPassword) {
      alert("비밀번호가 다릅니다.");
      return;
    } else if (password.length < 8) {
      alert("비밀번호를 8자리 이상으로 입력해주세요!");
      return;
    }
    // 중복된 아이디인지 확인
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/${id}`
      );
      if (response.data.exists) {
        alert("중복된 아이디입니다.");
        return;
      }
    } catch (error) {
      console.error("중복 확인 오류:", error);
      return;
    }
    // 비밀번호 일치 여부 확인
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/signup`,
        {
          id,
          password,
        }
      );
      console.log(response.data);
      alert("회원가입이 완료되었습니다.");
    } catch (error) {
      console.error(error);
      alert("에러");
    }
  };

  return (
    <div className={styles.container}>
      {/* <div className={styles.topColor}></div> */}
      <div className={`${styles.menu} ${styles.il}`}>오 뎅 탕</div>
      <div className={`${styles.menu} ${styles.ee}`}>계란말이</div>
      <div className={`${styles.menu} ${styles.sam}`}>잔치국수</div>
      <div className={`${styles.wave} ${styles.zero} ${styles.even}`}></div>
      <div className={`${styles.wave} ${styles.one} ${styles.odd}`}></div>
      <div className={`${styles.wave} ${styles.two} ${styles.even}`}></div>
      <div className={`${styles.wave} ${styles.three} ${styles.odd}`}></div>
      <div className={`${styles.wave} ${styles.four} ${styles.even}`}></div>
      <div className={`${styles.wave} ${styles.five} ${styles.odd}`}></div>
      <div className={`${styles.wave} ${styles.six} ${styles.even}`}></div>
      <div className={`${styles.wave} ${styles.seven} ${styles.odd}`}></div>
      <div className={`${styles.wave} ${styles.eight} ${styles.even}`}></div>
      <div className={`${styles.wave} ${styles.nine} ${styles.odd}`}></div>
      <div className={`${styles.wave} ${styles.ten} ${styles.even}`}></div>
      <div className={styles.serviceTitle}>
        <h1>홈술포차</h1>
      </div>
      <div className={styles.loginWrap}>
        <div className={styles.signup}>
          <div className={styles.eachInput}>
            <span>ID</span>
            <input
              type="text"
              placeholder="Id"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div className={styles.eachInput}>
            <span>PW</span>
            <input
              type="Password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={styles.eachInput}>
            <span>PW확인</span>
            <input
              type="Password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button onClick={handleSignUp}>SIGN UP</button>
        </div>
        <div className={styles.login}>
          <div className={styles.eachInput}>
            <span>ID</span>
            <input
              type="text"
              placeholder="Id"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
            />
          </div>
          <div className={styles.eachInput}>
            <span>PW</span>
            <input
              type="Password"
              placeholder="비밀번호"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>
          <button onClick={handleLogIn}>SIGN IN</button>
        </div>
      </div>
      <div className={styles.bottomColor}></div>
    </div>
  );
};

export default Login;
