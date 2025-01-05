import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRoutes } from 'react-router-dom'
import routes from './Routes'
import styles from './App.module.css'
export default function App() {

  let router = useRoutes(routes);
  return (
    <>
      {router}
    </>
  )
}
