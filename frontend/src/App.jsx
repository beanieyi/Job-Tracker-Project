import { useState, useEffect } from "react"
import "./App.css"
import NavTabs from './components/NavTabs'

function App() {
  return (
    <div>
      <h1 className="header">
        Robin Yi
      </h1>
      <nav>
        <NavTabs/>
      </nav>
    </div>
  )

}

export default App;