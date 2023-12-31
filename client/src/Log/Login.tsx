/* Login.tsx */
import React, { useState } from "react";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login: React.FC = () => {
  const [loginId, setLoginId] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [nickName, setNickname] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [signupForm, setsignupForm] = useState<boolean>(false);

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
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data}`;
      navigate("/lobby");
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인 실패");
    }
  };
  const handleSignUp = async (e: React.FormEvent) => {
    const whiteSpaceRegex = /\s/;

    if (
      !id ||
      !password ||
      !confirmPassword ||
      !nickName ||
      whiteSpaceRegex.test(id) ||
      whiteSpaceRegex.test(password) ||
      whiteSpaceRegex.test(confirmPassword)
    ) {
      alert("공백이 없는 모든 정보를 입력해주세요.");
      return;
    } else if (/^\s/.test(nickName) || !nickName.trim()) {
      alert("닉네임 처음에는 공백이 없어야 합니다.");
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
      console.log(response.data);
      if (response.data) {
        alert("중복된 아이디입니다.");
        return;
      }
    } catch (error) {
      console.error("중복 확인 오류:", error);
      return;
    }
    //nickname 일치 여부 확인
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/${nickName}`
      );
      console.log(response.data);
      if (response.data) {
        alert("중복된 닉네임입니다.");
        return;
      }
    } catch (error) {
      console.error("중복 확인 오류:", error);
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/signup`,
        {
          id,
          password,
          nickName,
        }
      );

      alert("회원가입이 완료되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };
  const handlePressKeyTosignIn = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleLogIn(event);
    }
  };

  const hadlePressKeyToSignUp = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSignUp(event);
    }
  };

  return (
    <>
      <div className={styles.loginWholeWrap}></div>
      <div className={styles.container}>
        <div className={styles.serviceTitleDiv}>
          <h1 className={styles.serviceTitle}>홈술포차</h1>
        </div>
        <div className={styles.loginWrap}>
          {signupForm ? (
            <div className={styles.signup}>
              <div className={styles.eachInput}>
                <span>아이디</span>
                <input
                  className={styles.loginInput}
                  type="text"
                  placeholder="Id"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </div>
              <div className={styles.eachInput}>
                <span>비밀번호</span>
                <input
                  className={styles.loginInput}
                  type="Password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className={styles.eachInput}>
                <span>비밀번호 확인</span>
                <input
                  className={styles.loginInput}
                  type="Password"
                  placeholder="비밀번호 확인"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className={styles.eachInput}>
                <span>닉네임</span>
                <input
                  className={styles.loginInput}
                  type="text"
                  placeholder="nickname"
                  value={nickName}
                  onChange={(e) => setNickname(e.target.value)}
                  onKeyPress={hadlePressKeyToSignUp}
                />
              </div>
              <div className={styles.buttonContainer}>
                <button
                  className={styles.loginPageButton}
                  onClick={handleSignUp}
                >
                  회원가입
                </button>
                <button
                  className={styles.loginPageButton}
                  onClick={() => {
                    setsignupForm(false);
                  }}
                >
                  로그인하기
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.login}>
              <div className={styles.eachInput}>
                <span>아이디</span>
                <input
                  className={styles.loginInput}
                  type="text"
                  placeholder="Id"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                />
              </div>
              <div className={styles.eachInput}>
                <span>비밀번호</span>
                <input
                  className={styles.loginInput}
                  type="Password"
                  placeholder="비밀번호"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyPress={handlePressKeyTosignIn}
                />
              </div>
              <div className={styles.buttonContainer}>
                <button
                  className={styles.loginPageButton}
                  onClick={() => setsignupForm(true)}
                >
                  회원가입
                </button>
                <button
                  className={styles.loginPageButton}
                  onClick={handleLogIn}
                >
                  로그인
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* CSS영역 */}
      <div>
        {/* <div className={`${styles.menu} ${styles.il}`}>오 뎅 탕</div>
        <div className={`${styles.menu} ${styles.ee}`}>계란말이</div>
        <div className={`${styles.menu} ${styles.sam}`}>잔치국수</div> */}
        {/* <div className={`${styles.wave} ${styles.zero} ${styles.even}`}></div>
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
        <div className={`${styles.wave} ${styles.eleven} ${styles.odd}`}></div>
        <div className={`${styles.wave} ${styles.twelve} ${styles.even}`}></div>
        <div
          className={`${styles.wave} ${styles.thirteen} ${styles.odd}`}
        ></div>
        <div
          className={`${styles.wave} ${styles.fourteen} ${styles.even}`}
        ></div>
        <div className={`${styles.wave} ${styles.fifteen} ${styles.odd}`}></div>
        <div
          className={`${styles.wave} ${styles.sixteen} ${styles.even}`}
        ></div>
        <div
          className={`${styles.wave} ${styles.seventeen} ${styles.odd}`}
        ></div>
        <div
          className={`${styles.wave} ${styles.eighteen} ${styles.even}`}
        ></div>
        <div
          className={`${styles.wave} ${styles.nineteen} ${styles.odd}`}
        ></div>
        <div className={styles.bottomColor}></div> */}
      </div>
    </>
  );
};

export default Login;
