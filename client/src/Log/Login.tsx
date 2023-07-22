/* Login.tsx */
import React, { useState, useEffect } from "react";
import styles from "./Login.module.css";
import {useNavigate} from "react-router-dom";
import axios from "axios";


const Login: React.FC = () => {
    const [flag, setFlag] = useState<number>(0);
    const [id, setId] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const navigate = useNavigate();

    const handleLogIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id.trim && !password.trim){
            alert("회원정보를 입력해주세요.");
            return;
        }
        else if (!id.trim){
            alert("아이디를 입력해주세요.");
            return;
        }
        else if (!password.trim){
            alert("비밀번호를 입력해주세요.");
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/login`, {
            //const response = await axios.post("https://hompocha.site/api/user/login", {
                id,
                password,
            });
            console.log(response.data);

            alert("로그인 성공");
            navigate("/Lobby");
        } catch (error) {
            console.error("로그인 오류:", error);
            alert("로그인 실패");
        }
    };
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !name || !password || !confirmPassword) {
            alert("모든 정보를 입력해주세요.");
            return;
        }
        if (password !== confirmPassword) {
            alert("비밀번호가 다릅니다.");
            return;
        }
        // 중복된 아이디인지 확인
        try {
            const response = await axios.get(
                // `https://hompocha.site/api/user/${id}`
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
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/signup`, {
                id,
                name,
                password,
            });
            console.log(response.data);
            alert("회원가입이 완료되었습니다.");
            setFlag((prevFlag) => (prevFlag === 0 ? 1 : 0));
        } catch (error) {
            console.error(error);
            alert("에러");
        }
    };

    const handleSignInUpChange = (): void => {
        setFlag((prevFlag) => (prevFlag === 0 ? 1 : 0));
    };

    useEffect(() => {
        const title = document.querySelector(`.${styles.title}`);
        const light = document.querySelector(`.${styles.light}`);
        const name = document.querySelector(`.${styles.name}`);
        const bButton = document.querySelector(`.${styles.bButton}`);
        const pButton = document.querySelector(`.${styles.pButton}`);
        const forgot = document.querySelector(`.${styles.forgot}`);
        const form = document.querySelector(`.${styles.form}`);
        const move = document.querySelector(`.${styles.move}`);
        if (flag === 0) {
            setTimeout(() => {
                if (title) title.textContent = "Create Account";
                if (light) light.textContent = "Or use your email for registration";
                if (name) name.classList.remove(styles.hide);
                if (bButton) bButton.textContent = "SIGN IN";
                if (pButton) pButton.textContent = "SIGN UP";
                if (forgot) forgot.classList.add(styles.hide);
                if (form) form.classList.remove(styles.rightRadius);
                if (move) move.classList.add(styles.leftRadius);
            }, 200);
        } else {
            setTimeout(() => {
                if (title) title.textContent = "Sign-in in to Pixmy";
                if (light) light.textContent = "Or use your email account";
                if (name) name.classList.add(styles.hide);
                if (bButton) bButton.textContent = "SIGN UP";
                if (pButton) pButton.textContent = "SIGN IN";
                if (forgot) forgot.classList.remove(styles.hide);
                if (form) form.classList.add(styles.rightRadius);
                if (move) move.classList.remove(styles.leftRadius);
            }, 200);
        }

    }, [flag]);

    return (
        <div className={styles.container}>
            <div
                className={`${styles.move} ${
                    flag === 1 ? styles.moving : styles.start
                }`}
                onClick={handleSignInUpChange}
            >
                <div
                    className={`${styles.pButton} ${styles.normal} ${styles.signin} ${styles.animated} ${styles.pulse}`}
                >
                    SIGN IN
                </div>
            </div>

            <div
                className={styles.welcome}
                style={{ display: flag === 0 ? "block" : "none" }}
            >
                <h4 className={`${styles.bold} ${styles.welcomeText}`}>
                    Welcome Back!
                </h4>
                <p className={`${styles.normal} ${styles.text}`}>
                    To keep connected with us please login with your personal info
                </p>
            </div>
            <div
                className={styles.hello}
                style={{ display: flag === 1 ? "block" : "none" }}
            >
                <h4 className={`${styles.bold} ${styles.welcomeText}`}>
                    Hello Friend
                </h4>
                <p className={`${styles.normal} ${styles.text}`}>
                    Enter your personal details and start journey with us
                </p>
            </div>
            <div
                className={`${styles.form} ${
                    flag === 1 ? styles.movingForm : styles.startForm
                }`}
            >
                <h4 className={`${styles.bold} ${styles.title}`}>Create Account</h4>
                <div className={styles.icons}>
                    <div className={styles.icon}>
                        <i className="fab fa-facebook-f"></i>
                    </div>
                    <div className={styles.icon}>
                        <i className="fab fa-github"></i>
                    </div>
                    <div className={styles.icon}>
                        <i className="fab fa-twitter"></i>
                    </div>
                </div>
                <p className={`${styles.normal} ${styles.light}`}>
                    Or use your email for registration
                </p>
                <input
                    type="text"
                    placeholder="Id"
                    className={`${styles.normal} ${styles.name}`}
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
                {flag === 1 && (
                    <div>
                        <input
                            type="text"
                            placeholder="Name"
                            className={`${styles.normal} ${styles.name}`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                )}
                <input
                    type="password"
                    placeholder="비밀번호"
                    className={styles.normal}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {flag === 1 && (
                    <div>
                        <input
                            type="password"
                            placeholder="비밀번호 확인"
                            className={styles.normal}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                )}
                <br />
                {flag !== 1 && (
                    <button className={`${styles.bButton} ${styles.normal}`} onClick={handleLogIn}>
                        SIGN IN
                    </button>)}
                {flag === 1 && (
                    <button className={`${styles.bButton} ${styles.normal}`} onClick={handleSignUp}>SIGN UP</button>
                )}
            </div>
        </div>
    );
};

export default Login;
