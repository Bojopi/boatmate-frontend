// import { useEffect } from "react";
// import { io } from "socket.io-client";


// const socket = io('https://boatmate.com', {
//     auth: {token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjMsImVtYWlsIjoianVhbkBnbWFpbC5jb20iLCJzdGF0ZSI6dHJ1ZSwiZ29vZ2xlIjpmYWxzZSwiaWRQZXJzb24iOjMsIm5hbWUiOiJKdWFuIiwibGFzdG5hbWUiOiJNYWdhbiIsInBob25lIjoiNzc1ODk5MDQiLCJpbWFnZSI6Imh0dHBzOi8vcmVzLmNsb3VkaW5hcnkuY29tL2Rxd3N1bzRjci9pbWFnZS91cGxvYWQvdjE2ODQ3MTIyMzIvYm9hdG1hdGUvdHUxbGhvczRwbjlrOWlhcXV2ODcuanBnIiwiaWRSb2xlIjo0LCJyb2xlIjoiQ1VTVE9NRVIiLCJpZEN1c3RvbWVyIjoxLCJjdXN0b21lckxhdCI6Ii0xNy43NTU3MDYzOTkxNzMwMTUiLCJjdXN0b21lckxuZyI6Ii02My4xOTAxMjk5OTUzNDYwNyIsImN1c3RvbWVyWmlwIjpudWxsLCJpYXQiOjE2OTExNTUxOTYsImV4cCI6MTY5MTIzNzk5Nn0.pz0jsvSOC-5Q-x5Ijwoastg64I8GkWTMkkGnnDHkHMg'},
// });
// useEffect(() => {
//     socket.on('connect', () => {
//     });
//     socket.on('test', (data) => {
//         console.log(data)
//     })
//     socket.on('connect_error', (err) => {
//         console.log('connect error: ', err)
//     })
//     socket.on('contract-create', (data) => {
//         console.log('league-info: ', data)
//     })
// }, [])