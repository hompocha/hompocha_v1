// const express = require("express");
// const mysql = require("mysql");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.json());
// const conn = mysql.createConnection({
//     host: "myfirstaurora.cluster-ca20wf9mu7tr.ap-northeast-2.rds.amazonaws.com",
//     port: "3306",
//     user: "admin",
//     password: "wn6761420",
//     database: "test",
// });
//
// conn.connect((err) => {
//     if (err) {
//         console.error("MySQL 연결 오류:", err);
//         return;
//     }
//     console.log("MySQL에 성공적으로 연결되었습니다.");
// });
//
// app.listen(3001, () => {
//     console.log("서버가 3001 포트에서 실행 중입니다.");
// });
//
// app.post("/api/signup", (req, res) => {
//     const { id, name, password } = req.body;
//
//     const sql = "INSERT INTO user (id, name, password) VALUES (?, ?, ?)";
//     const params = [id, name, password];
//     conn.query(sql, params, (err, result) => {
//         if (err) {
//         console.error("INSERT 오류:", err);
//         res.status(500).json({ error: "데이터베이스 INSERT 오류" });
//         return;
//         }
//
//         console.log("데이터베이스 INSERT 성공:", result);
//         res.status(200).json({ success: true });
//     });
// });
// // 중복된 아이디 확인 엔드포인트
// app.get("/api/user/:id", (req, res) => {
//     const userId = req.params.id;
//
//     const sql = "SELECT EXISTS(SELECT 1 FROM user WHERE id = ?) AS exist";
//     const params = [userId];
//     conn.query(sql, params, (err, result) => {
//     if (err) {
//         console.error("SELECT 오류:", err);
//         res.status(500).json({ error: "데이터베이스 SELECT 오류" });
//         return;
//     }
//
//     const exists = result[0].exist === 1;
//     res.status(200).json({ exists });
//     });
// });
// // 로그인 엔드포인트
// let idPost;
// app.post("/api/login", (req, res) => {
//     const { id, password } = req.body;
//     const sql = "SELECT * FROM user WHERE id = ? AND password = ?";
//     const params = [id, password];
//     conn.query(sql, params, (err, result) => {
//         if (err) {
//             console.error("SELECT 오류:", err);
//             res.status(500).json({ error: "데이터베이스 SELECT 오류" });
//         return;
//     }
//
//     if (result.length === 0) {
//         res.status(401).json({ error: "로그인 실패" });
//         return;
//     }
//     idPost ={id};
//
//     console.log("로그인 성공");
//     res.status(200).json({ success: true });
//     });
// });
//
// app.get('/api/idPost', (req, res) => {
//     res.status(200).send(idPost);
// });
// app.post("/api/roomInfo", (req, res) => {
//     const { id, title, game, mode, inpeople, tag , master, maxpeople} = req.body;
//
//     const sql = "SELECT * FROM room WHERE id = ? AND title = ?";
//     const params = ['1', 'first'];
//     conn.query(sql, params, (err, results) => {
//         if (err) {
//             console.error('MySQL 쿼리 오류:', err);
//             res.status(500).json({ error: '서버 오류' });
//         }
//         else {
//             if (results.length === 0) {
//                 res.status(404).json({ error: '방을 찾을 수 없음' });
//             }
//             else {
//                 const roomData = results[0];
//                 res.json({ room: roomData });
//             }
//         }
//     });
// });
// app.get("/api/keyword", (req, res) => {
//     const sql = "SELECT word FROM keyword";
//     conn.query(sql, (err, result) => {
//     if (err) {
//         console.error("SELECT 오류:", err);
//         res.status(500).json({ error: "데이터베이스 SELECT 오류" });
//         return;
//     }
//         const keywords = result.map((row) => row.word);
//         res.status(200).json({ keywords });
//     });
// });