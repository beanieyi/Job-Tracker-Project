import { useState, useEffect } from "react"
import "./App.css"
import NavTabs from './components/NavTabs'
import Example from './components/Header'

function App() {
  return (
    <div>
      <h1>
        <Example/>
      </h1>
      <nav>
        <NavTabs/>
      </nav>
    </div>
  )

}

export default App;