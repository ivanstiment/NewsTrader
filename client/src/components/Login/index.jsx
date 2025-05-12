import styles from "./Login.module.scss";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon, PadlockIcon } from "../Icons";
// import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/axios";

export function Login() {
  // const { setAccessToken } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");

  useEffect(() => {
    const prevDisplay = document.body.style.display;
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    return () => {
      document.body.style.display = prevDisplay;
    };
  }, []);

  // const handleLogin = async () => {
  //   try {
  //     const response = await axios.post("http://localhost:8000/api/token/", {
  //       username,
  //       password,
  //     });
  //     // const { access_token, refresh_token } = response.data;
  //     // Store tokens in local storage or state as needed

  //     setAccessToken(response.data.access); // guardamos access
  //     // refresh token ya está en cookie HTTP-Only
  //     navigate("/news");
  //   } catch (error) {
  //     console.error("Login failed", error);
  //   }
  // };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/token/", {
        username: formData.username,
        password: formData.password,
      });
      const accessToken = response.data.access;
      login(accessToken);
      setMessage("Login exitoso");
      navigate("/news");
    } catch (error) {
      setMessage("Error de autenticación");
    }
  };

  // const handleSubmit = async () => {
  //   const resp = await api.post('token/', { username, password });
  //   const { access } = resp.data;
  //   login(access);                      // guarda access en memoria
  //   // refresh se envía como HttpOnly cookie automáticamente
  //   navigate('/news');
  // };

  return (
    <div className={styles.login__container}>
      <div className={styles.login__card}>
        <form onSubmit={handleSubmit}>
          <p className={styles.login__title}>¡Bienvenido de nuevo!</p>
          <div className={styles.login__inputWrapper}>
            <p className={styles.login__paragraph}>
              <UserIcon width={24} height={24} className={styles.login__svg} />
              <label htmlFor="user">Usuario</label>
            </p>
            <input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={styles.login__input}
            ></input>
          </div>
          <div className={styles.login__inputWrapper}>
            <p className={styles.login__paragraph}>
              <PadlockIcon
                width={24}
                height={24}
                className={styles.login__svg}
              />
              <label htmlFor="password">Password</label>
            </p>
            <input
              id="password"
              name="password"
              className={styles.login__input}
              value={formData.password}
              onChange={handleChange}
            ></input>
          </div>
          <div className={styles.login__buttons}>
            {/* <button className={styles.login__buttonRight} onClick={handleLogin}> */}
            <button className={styles.login__buttonRight} type="submit">
              Continuar
            </button>
          </div>
        </form>        
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

// export default Login;
