import { useState } from "react";
import Quiz from "./Quiz";
import './index.css'

export default function App() {
  const [started, setStarted] = useState(false);
  const [candidate, setCandidate] = useState({
    name: "",
    email: "",
  });

  function startTest() {
    if (!candidate.name || !candidate.email) {
      alert("Enter name and email");
      return;
    }

    // fullscreen enable
    document.documentElement.requestFullscreen();
    setStarted(true);
  }

  if (!started) {
    return (
      <div className="start-container">
        <h2>Candidate Details</h2>

        <input
          placeholder="Enter Name"
          value={candidate.name}
          onChange={(e) =>
            setCandidate({ ...candidate, name: e.target.value })
          }
        />

        <input
          placeholder="Enter Email"
          value={candidate.email}
          onChange={(e) =>
            setCandidate({ ...candidate, email: e.target.value })
          }
        />

        <button onClick={startTest}>
          Start Full Screen Test
        </button>
      </div>
    );
  }

  return <Quiz candidate={candidate} />;
}
