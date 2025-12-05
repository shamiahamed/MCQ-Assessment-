import React, { useEffect, useState } from "react";
import axios from "axios";
import questions from "./data/questions";
import "./index.css";

export default function Quiz({ candidate }) {

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [time, setTime] = useState(10 * 60);
  const [dark, setDark] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // ✅ EMAIL VALIDATION STATES
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [started, setStarted] = useState(false);

  // ---------- PAGE RELOAD CONTROL ----------
  useEffect(() => {
    let reloadCount = localStorage.getItem("reloadCount");

    if (!reloadCount) {
      localStorage.setItem("reloadCount", 1);
    } else {
      reloadCount = parseInt(reloadCount) + 1;
      localStorage.setItem("reloadCount", reloadCount);

      if (reloadCount === 2) {
        alert("⚠️ Warning: Reloading again will END your test!");
      }

      if (reloadCount >= 3) {
        submitTest();
      }
    }
  }, []);

  // ---------- RESET ON TAB CLOSE ----------
  useEffect(() => {
    const clearSession = () => {
      localStorage.removeItem("candidate");
      localStorage.removeItem("reloadCount");
    };

    window.addEventListener("beforeunload", clearSession);

    return () => {
      window.removeEventListener("beforeunload", clearSession);
    };
  }, []);

  // ---------- TIMER ----------
  useEffect(() => {
    if (!started || submitted) return;

    const t = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [submitted, started]);

  // ---------- EMAIL CHECK ----------
  const isValidEmail = (mail) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(mail);
  };

  const startTest = () => {
    if (!isValidEmail(email)) {
      setEmailError("❌ Please enter a VALID email address");
      return;
    }

    setEmailError("");
    setStarted(true);

    candidate.email = email;
  };

  // ---------- SUBMIT ----------
  const submitTest = async () => {
    localStorage.removeItem("reloadCount");

    let score = 0;

    questions.forEach((q, i) => {
      if (answers[i] === q.answer) score++;
    });

    await axios.get("/api/result", {
      name: candidate.name,
      email: candidate.email,
      score,
      total: questions.length  
    });

    setSubmitted(true);

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const choose = (opt) => {
    setAnswers({ ...answers, [current]: opt });
  };

  const formatTime = () => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  // ---------- START SCREEN ----------
  if (!started) {
    return (
      <div className="start-screen">
        <h2>📝 Online Quiz</h2>

        <input
          type="email"
          placeholder="Enter valid email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {emailError && (
          <p style={{ color: "red" }}>{emailError}</p>
        )}

        <button onClick={startTest}>
          START TEST
        </button>
      </div>
    );
  }

  // ---------- SUBMITTED ----------
  if (submitted) {
    return (
      <div className="submitted">
        <h1 style={{ color: "green" }}>
          ✅ TEST SUBMITTED SUCCESSFULLY
        </h1>

        <p>We will get back to you soon.</p>

        <button onClick={() => window.close()}>
          Close Tab
        </button>
      </div>
    );
  }

  // ---------- MAIN QUIZ ----------
  return (
    <div className={dark ? "dark" : "light"}>

      {/* -------- TOP BAR ---------- */}
      <div className="top-bar">
        <button onClick={() => setDark(!dark)}>
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>

        <div className={time <= 120 ? "timer blink" : "timer"}>
          ⏱ {formatTime()}
        </div>
      </div>

      {time <= 480 && !submitted && (
        <div className="time-warning">
          ⚠️ WARNING: Only {Math.floor(time / 60)} minutes left!
        </div>
      )} 

      {/* ---------- PALETTE ---------- */}
      <div className="palette">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={answers[i] ? "answered" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* -------- QUESTION ---------- */}
      <h2>
        {current + 1}. {questions[current].question}
      </h2>

      {/* -------- OPTIONS ---------- */}
      {questions[current].options.map((opt, i) => (
        <label key={i} className="option">
          <input
            type="radio"
            checked={answers[current] === opt}
            onChange={() => choose(opt)}
          />
          {opt}
        </label>
      ))}

      {/* -------- NAVIGATION ---------- */}
      <div style={{ marginTop: 20 }}>

        <button
          disabled={current === 0}
          onClick={() => setCurrent(current - 1)}
        >
          ◀ Prev
        </button>

        <button
          disabled={current === questions.length - 1}
          onClick={() => setCurrent(current + 1)}
        >
          Next ▶
        </button>

        <button
          className="submit-btn"
          onClick={submitTest}
        >
          SUBMIT TEST
        </button>

      </div>

    </div>
  );
}
