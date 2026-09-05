import { useEffect, useMemo, useState } from "react";
import { getPyqIndex, getPyqPaper } from "../services/questionApi";
import "./Pyq.css";

const LETTERS = ["A", "B", "C", "D"];

function getMarkingScheme(exam) {
  // Default marking
  let marksPerQuestion = 1;
  let negativeMarking = false;
  let negativeMarksPerQuestion = 0;

  if (!exam) {
    return {
      marksPerQuestion,
      negativeMarking,
      negativeMarksPerQuestion,
    };
  }

  // If your JSON contains explicit marking rules, use them.
  if (typeof exam.marksPerQuestion === "number") {
    marksPerQuestion = exam.marksPerQuestion;
  }

  if (typeof exam.negativeMarks === "number") {
    negativeMarking = exam.negativeMarks > 0;
    negativeMarksPerQuestion = exam.negativeMarks;
  }

  if (typeof exam.negativeMarking === "boolean") {
    negativeMarking = exam.negativeMarking;

    if (!negativeMarking) {
      negativeMarksPerQuestion = 0;
    }
  }

  /*
    RRB Group D normally uses:
    +1 for correct
    -1/3 for wrong
    0 for unanswered
  */
  if (
    exam.exam &&
    exam.exam.toLowerCase().includes("rrb group d") &&
    typeof exam.negativeMarks !== "number" &&
    typeof exam.negativeMarking !== "boolean"
  ) {
    negativeMarking = true;
    negativeMarksPerQuestion = 1 / 3;
  }

  return {
    marksPerQuestion,
    negativeMarking,
    negativeMarksPerQuestion,
  };
}

export default function Pyq() {
  /* --------------------------------------------------
     DATA STATES
  -------------------------------------------------- */

  const [data, setData] = useState(null);

  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(null);

  const [paperData, setPaperData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [paperLoading, setPaperLoading] = useState(false);
  const [error, setError] = useState("");

  /* --------------------------------------------------
     CBT STATES
  -------------------------------------------------- */

  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState(new Set());

  const [timeLeft, setTimeLeft] = useState(0);

  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [result, setResult] = useState(null);

  /* --------------------------------------------------
     LOAD PYQ INDEX
  -------------------------------------------------- */

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const response = await getPyqIndex();

        setData(response);
      } catch (err) {
        console.error(err);
        setError("Unable to load PYQ data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  /* --------------------------------------------------
     EXAMS
  -------------------------------------------------- */

  const exams = useMemo(() => {
    if (!data?.pyq || !Array.isArray(data.pyq)) {
      return [];
    }

    return data.pyq;
  }, [data]);

  /* --------------------------------------------------
     SELECT EXAM
  -------------------------------------------------- */

  function handleExamSelect(exam) {
    setSelectedExam(exam);

    setSelectedLanguage(null);
    setSelectedPaper(null);
    setPaperData(null);

    resetTest();
  }

  /* --------------------------------------------------
     LANGUAGES
  -------------------------------------------------- */

  const languages = useMemo(() => {
    if (
      !selectedExam?.languages ||
      !Array.isArray(selectedExam.languages)
    ) {
      return [];
    }

    return selectedExam.languages;
  }, [selectedExam]);

  /* --------------------------------------------------
     SELECT LANGUAGE
  -------------------------------------------------- */

  function handleLanguageSelect(language) {
    setSelectedLanguage(language);

    setSelectedPaper(null);
    setPaperData(null);

    resetTest();
  }

  /* --------------------------------------------------
     PAPERS
  -------------------------------------------------- */

  const papers = useMemo(() => {
    if (
      !selectedLanguage?.papers ||
      !Array.isArray(selectedLanguage.papers)
    ) {
      return [];
    }

    return selectedLanguage.papers;
  }, [selectedLanguage]);

  /* --------------------------------------------------
     SELECT PAPER
  -------------------------------------------------- */

  async function handlePaperSelect(paper) {
    try {
      setSelectedPaper(paper);
      setPaperData(null);
      setPaperLoading(true);
      setError("");

      const response = await getPyqPaper(paper.file);

      setPaperData(response);
    } catch (err) {
      console.error(err);
      setError("Unable to load this paper.");
    } finally {
      setPaperLoading(false);
    }
  }

  /* --------------------------------------------------
     QUESTIONS
  -------------------------------------------------- */

  const questions = useMemo(() => {
    if (
      !paperData?.questions ||
      !Array.isArray(paperData.questions)
    ) {
      return [];
    }

    return paperData.questions;
  }, [paperData]);

  const question = questions[currentQuestion];

  /* --------------------------------------------------
     MARKING SCHEME
  -------------------------------------------------- */

  const markingScheme = useMemo(() => {
    return getMarkingScheme(selectedExam);
  }, [selectedExam]);

  /* --------------------------------------------------
     START TEST
  -------------------------------------------------- */

  function startTest() {
    if (questions.length === 0) {
      return;
    }

    const durationMinutes =
      Number(selectedExam?.duration) || 90;

    setAnswers({});
    setMarkedQuestions(new Set());

    setCurrentQuestion(0);

    setTimeLeft(durationMinutes * 60);

    setResult(null);
    setTestFinished(false);
    setShowSubmitModal(false);

    setTestStarted(true);
  }

  /* --------------------------------------------------
     RESET TEST
  -------------------------------------------------- */

  function resetTest() {
    setTestStarted(false);
    setTestFinished(false);

    setCurrentQuestion(0);

    setAnswers({});
    setMarkedQuestions(new Set());

    setTimeLeft(0);

    setResult(null);
    setShowSubmitModal(false);
  }

  /* --------------------------------------------------
     TIMER
  -------------------------------------------------- */

  useEffect(() => {
    if (!testStarted || testFinished) {
      return;
    }

    if (timeLeft <= 0) {
      finishTest(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, testFinished, timeLeft]);

  /* --------------------------------------------------
     FORMAT TIME
  -------------------------------------------------- */

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor((seconds % 3600) / 60);

    const remainingSeconds = seconds % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      remainingSeconds.toString().padStart(2, "0"),
    ].join(":");
  }

  /* --------------------------------------------------
     SELECT ANSWER
  -------------------------------------------------- */

  function selectAnswer(optionIndex) {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion]: optionIndex,
    }));
  }

  /* --------------------------------------------------
     CLEAR RESPONSE
  -------------------------------------------------- */

  function clearResponse() {
    setAnswers((previous) => {
      const updated = { ...previous };

      delete updated[currentQuestion];

      return updated;
    });
  }

  /* --------------------------------------------------
     MARK / UNMARK
  -------------------------------------------------- */

  function toggleMark() {
    setMarkedQuestions((previous) => {
      const updated = new Set(previous);

      if (updated.has(currentQuestion)) {
        updated.delete(currentQuestion);
      } else {
        updated.add(currentQuestion);
      }

      return updated;
    });
  }

  /* --------------------------------------------------
     NEXT QUESTION
  -------------------------------------------------- */

  function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  }

  /* --------------------------------------------------
     PREVIOUS QUESTION
  -------------------------------------------------- */

  function previousQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
    }
  }

  /* --------------------------------------------------
     FINISH TEST
  -------------------------------------------------- */

  function finishTest(autoSubmit = false) {
    if (questions.length === 0) {
      return;
    }

    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    questions.forEach((item, index) => {
      const selectedAnswer = answers[index];

      if (
        selectedAnswer === undefined ||
        selectedAnswer === null
      ) {
        unanswered++;
        return;
      }

      const correctAnswer = Number(item.correctAnswer);

      if (selectedAnswer === correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });

    const {
      marksPerQuestion,
      negativeMarking,
      negativeMarksPerQuestion,
    } = markingScheme;

    const positiveMarks =
      correct * marksPerQuestion;

    const negativeMarks = negativeMarking
      ? wrong * negativeMarksPerQuestion
      : 0;

    const finalScore =
      positiveMarks - negativeMarks;

    const totalMarks =
      questions.length * marksPerQuestion;

    const percentage =
      totalMarks > 0
        ? (finalScore / totalMarks) * 100
        : 0;

    const calculatedResult = {
      correct,
      wrong,
      unanswered,
      positiveMarks,
      negativeMarks,
      finalScore,
      totalMarks,
      percentage,
      autoSubmit,
    };

    setResult(calculatedResult);

    setTestFinished(true);
    setTestStarted(false);
    setShowSubmitModal(false);
  }

  /* --------------------------------------------------
     SUBMIT CONFIRM
  -------------------------------------------------- */

  function confirmSubmit() {
    finishTest(false);
  }

  /* --------------------------------------------------
     BACK TO SELECTION
  -------------------------------------------------- */

  function backToSelection() {
    resetTest();
    setSelectedPaper(null);
    setPaperData(null);
  }

  /* --------------------------------------------------
     LOADING
  -------------------------------------------------- */

  if (loading) {
    return (
      <div className="pyq-page">
        <div className="pyq-loading">
          <div className="loading-spinner"></div>
          <p>Loading previous year papers...</p>
        </div>
      </div>
    );
  }

  /* --------------------------------------------------
     ERROR
  -------------------------------------------------- */

  if (error && !paperLoading) {
    return (
      <div className="pyq-page">
        <div className="pyq-error">
          <h2>Something went wrong</h2>

          <p>{error}</p>

          <button
            className="primary-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* --------------------------------------------------
     RESULT SCREEN
  -------------------------------------------------- */

  if (testFinished && result) {
    return (
      <div className="pyq-page result-page">

        <div className="result-container">

          <div className="result-header">

            <div className="result-success-icon">
              ✓
            </div>

            <h1>Test Completed</h1>

            <p>
              {selectedPaper?.name}
            </p>

            {result.autoSubmit && (
              <div className="auto-submit-message">
                Time is over. Your test was submitted
                automatically.
              </div>
            )}

          </div>

          <div className="score-card">

            <div className="score-label">
              Your Score
            </div>

            <div className="score-value">
              {result.finalScore.toFixed(2)}
            </div>

            <div className="score-total">
              out of {result.totalMarks}
            </div>

            <div className="score-percentage">
              {result.percentage.toFixed(2)}%
            </div>

          </div>

          <div className="result-stats">

            <div className="result-stat correct-stat">
              <span className="stat-number">
                {result.correct}
              </span>

              <span className="stat-label">
                Correct
              </span>
            </div>

            <div className="result-stat wrong-stat">
              <span className="stat-number">
                {result.wrong}
              </span>

              <span className="stat-label">
                Wrong
              </span>
            </div>

            <div className="result-stat unanswered-stat">
              <span className="stat-number">
                {result.unanswered}
              </span>

              <span className="stat-label">
                Unanswered
              </span>
            </div>

          </div>

          <div className="marking-card">

            <h3>Marking Details</h3>

            <div className="marking-row">
              <span>Correct Answers</span>

              <strong>
                +{result.positiveMarks.toFixed(2)}
              </strong>
            </div>

            <div className="marking-row">
              <span>Negative Marks</span>

              <strong className="negative-score">
                -{result.negativeMarks.toFixed(2)}
              </strong>
            </div>

            <div className="marking-row">
              <span>Final Score</span>

              <strong>
                {result.finalScore.toFixed(2)}
              </strong>
            </div>

            {markingScheme.negativeMarking && (
              <p className="negative-info">
                Each wrong answer carries a negative
                marking of{" "}
                {markingScheme.negativeMarksPerQuestion ===
                1 / 3
                  ? "1/3"
                  : markingScheme.negativeMarksPerQuestion}
                .
              </p>
            )}

          </div>

          <div className="result-actions">

            <button
              className="secondary-btn"
              onClick={() => {
                setTestFinished(false);
                setResult(null);
              }}
            >
              Review Questions
            </button>

            <button
              className="primary-btn"
              onClick={startTest}
            >
              Retake Test
            </button>

            <button
              className="outline-btn"
              onClick={backToSelection}
            >
              Back to Papers
            </button>

          </div>

          <div className="review-section">

            <h2>Question Review</h2>

            {questions.map((item, index) => {

              const userAnswer = answers[index];

              const correctAnswer =
                Number(item.correctAnswer);

              const answered =
                userAnswer !== undefined &&
                userAnswer !== null;

              const isCorrect =
                answered &&
                userAnswer === correctAnswer;

              return (
                <div
                  key={item.id ?? index}
                  className={`review-card ${
                    !answered
                      ? "review-unanswered"
                      : isCorrect
                      ? "review-correct"
                      : "review-wrong"
                  }`}
                >

                  <div className="review-question-header">

                    <strong>
                      Question {index + 1}
                    </strong>

                    <span>
                      {!answered
                        ? "Unanswered"
                        : isCorrect
                        ? "Correct"
                        : "Wrong"}
                    </span>

                  </div>

                  <div className="review-question">
                    {item.question}
                  </div>

                  <div className="review-answer-row">

                    <div>
                      <span>Your Answer</span>

                      <strong>
                        {answered
                          ? `${LETTERS[userAnswer]}. ${
                              item.options?.[userAnswer] ??
                              ""
                            }`
                          : "Not answered"}
                      </strong>
                    </div>

                    <div>
                      <span>Correct Answer</span>

                      <strong>
                        {LETTERS[correctAnswer]}.{" "}
                        {item.options?.[correctAnswer] ??
                          ""}
                      </strong>
                    </div>

                  </div>

                  {item.explanation && (
                    <div className="review-explanation">

                      <strong>
                        Explanation
                      </strong>

                      <p>
                        {item.explanation}
                      </p>

                    </div>
                  )}

                </div>
              );
            })}

          </div>

        </div>
      </div>
    );
  }

  /* --------------------------------------------------
     CBT SCREEN
  -------------------------------------------------- */

  if (testStarted && question) {
    const selectedAnswer =
      answers[currentQuestion];

    const isMarked =
      markedQuestions.has(currentQuestion);

    return (
      <div className="cbt-page">

        {/* CBT HEADER */}

        <header className="cbt-header">

          <div className="cbt-brand">
            DISXCITY
          </div>

          <div className="cbt-exam-info">

            <strong>
              {selectedExam?.exam}
            </strong>

            <span>
              {selectedPaper?.name}
            </span>

          </div>

          <div className="cbt-header-right">

            <div className="cbt-language-display">
              Language:{" "}
              <strong>
                {selectedLanguage?.language}
              </strong>
            </div>

            <div
              className={`cbt-timer ${
                timeLeft <= 300
                  ? "timer-danger"
                  : ""
              }`}
            >

              <span>
                TIME LEFT
              </span>

              <strong>
                {formatTime(timeLeft)}
              </strong>

            </div>

          </div>

        </header>

        {/* MAIN QUESTION AREA */}

        <main className="cbt-main">

          <section className="cbt-question-area">

            {/* QUESTION HEADER */}

            <div className="cbt-question-header">

              <div>
                <strong>
                  Question {currentQuestion + 1}
                </strong>

                <span>
                  {" "}
                  of {questions.length}
                </span>
              </div>

              {isMarked && (
                <span className="marked-label">
                  Marked for Review
                </span>
              )}

            </div>

            {/* QUESTION */}

            <div className="cbt-question-card">

              <div className="question-text">
                {question.question}
              </div>

              <div className="answer-instruction">
                Select the correct answer.
              </div>

              <div className="cbt-options">

                {question.options?.map(
                  (option, index) => {

                    const selected =
                      selectedAnswer === index;

                    return (
                      <label
                        key={index}
                        className={`cbt-option ${
                          selected
                            ? "selected"
                            : ""
                        }`}
                      >

                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          checked={selected}
                          onChange={() =>
                            selectAnswer(index)
                          }
                        />

                        <span className="option-radio">
                          {selected ? "✓" : ""}
                        </span>

                        <span className="option-letter">
                          {LETTERS[index]}
                        </span>

                        <span className="option-text">
                          {option}
                        </span>

                      </label>
                    );
                  }
                )}

              </div>

            </div>

            {/* QUESTION ACTIONS */}

            <div className="cbt-question-actions">

              <button
                className="clear-btn"
                onClick={clearResponse}
              >
                Clear Response
              </button>

              <button
                className={`mark-btn ${
                  isMarked
                    ? "mark-active"
                    : ""
                }`}
                onClick={toggleMark}
              >
                {isMarked
                  ? "Unmark Review"
                  : "Mark for Review"}
              </button>

            </div>

            {/* BOTTOM NAVIGATION */}

            <div className="cbt-bottom-nav">

              <button
                className="previous-btn"
                disabled={currentQuestion === 0}
                onClick={previousQuestion}
              >
                ← Previous
              </button>

              <span className="question-counter">
                {currentQuestion + 1} /{" "}
                {questions.length}
              </span>

              {currentQuestion ===
              questions.length - 1 ? (
                <button
                  className="submit-btn"
                  onClick={() =>
                    setShowSubmitModal(true)
                  }
                >
                  Submit Test
                </button>
              ) : (
                <button
                  className="next-btn"
                  onClick={nextQuestion}
                >
                  Save & Next →
                </button>
              )}

            </div>

          </section>

        </main>

        {/* SUBMIT MODAL */}

        {showSubmitModal && (
          <div className="modal-overlay">

            <div className="submit-modal">

              <div className="modal-icon">
                ?
              </div>

              <h2>
                Submit Test?
              </h2>

              <p>
                Are you sure you want to submit
                this test?
              </p>

              <div className="submit-summary">

                <div>
                  <span>Answered</span>

                  <strong>
                    {
                      Object.keys(answers)
                        .length
                    }
                  </strong>
                </div>

                <div>
                  <span>Unanswered</span>

                  <strong>
                    {
                      questions.length -
                      Object.keys(answers)
                        .length
                    }
                  </strong>
                </div>

                <div>
                  <span>Marked</span>

                  <strong>
                    {markedQuestions.size}
                  </strong>
                </div>

              </div>

              <div className="modal-actions">

                <button
                  className="cancel-btn"
                  onClick={() =>
                    setShowSubmitModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  className="confirm-submit-btn"
                  onClick={confirmSubmit}
                >
                  Submit Test
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    );
  }

  /* --------------------------------------------------
     SELECTION SCREEN
  -------------------------------------------------- */

  return (
    <div className="pyq-page">

      <div className="pyq-container">

        {/* PAGE HEADER */}

        <div className="pyq-page-header">

          <div>

            <span className="page-label">
              PREVIOUS YEAR QUESTIONS
            </span>

            <h1>
              Practice Previous Year Papers
            </h1>

            <p>
              Choose an exam, language and paper
              to start a CBT-style test.
            </p>

          </div>

        </div>

        {/* EXAM SELECTION */}

        {!selectedExam && (
          <section className="selection-section">

            <div className="section-heading">

              <span className="step-number">
                1
              </span>

              <div>
                <h2>
                  Select Exam
                </h2>

                <p>
                  Choose the examination you
                  want to practice.
                </p>
              </div>

            </div>

            <div className="selection-grid">

              {exams.map((exam, index) => (
                <button
                  key={index}
                  className="selection-card"
                  onClick={() =>
                    handleExamSelect(exam)
                  }
                >

                  <div className="selection-icon">
                    📚
                  </div>

                  <div className="selection-card-content">

                    <h3>
                      {exam.exam}
                    </h3>

                    <p>
                      {exam.languages?.reduce(
                        (total, language) =>
                          total +
                          (language.papers
                            ?.length || 0),
                        0
                      ) || 0}{" "}
                      papers
                    </p>

                  </div>

                  <span className="card-arrow">
                    →
                  </span>

                </button>
              ))}

            </div>

          </section>
        )}

        {/* LANGUAGE SELECTION */}

        {selectedExam && !selectedLanguage && (
          <section className="selection-section">

            <button
              className="back-link"
              onClick={() => {
                setSelectedExam(null);
                resetTest();
              }}
            >
              ← Back to Exams
            </button>

            <div className="selection-section-card">

              <div className="selected-info">

                <div className="selected-info-icon">
                  📚
                </div>

                <div>
                  <span>
                    Selected Exam
                  </span>

                  <strong>
                    {selectedExam.exam}
                  </strong>
                </div>

              </div>

              <div className="section-heading">

                <span className="step-number">
                  2
                </span>

                <div>
                  <h2>
                    Select Language
                  </h2>

                  <p>
                    Choose the language of your
                    question paper.
                  </p>
                </div>

              </div>

              <div className="language-grid">

                {languages.map(
                  (language, index) => (
                    <button
                      key={index}
                      className="language-card"
                      onClick={() =>
                        handleLanguageSelect(
                          language
                        )
                      }
                    >

                      <span className="language-icon">
                        🌐
                      </span>

                      <span>
                        {language.language}
                      </span>

                      <span className="language-arrow">
                        →
                      </span>

                    </button>
                  )
                )}

              </div>

            </div>

          </section>
        )}

        {/* PAPER SELECTION */}

        {selectedLanguage && !selectedPaper && (
          <section className="selection-section">

            <button
              className="back-link"
              onClick={() => {
                setSelectedLanguage(null);
                setSelectedPaper(null);
                setPaperData(null);
              }}
            >
              ← Back to Languages
            </button>

            <div className="selection-section-card">

              <div className="selected-info">

                <div className="selected-info-icon">
                  📄
                </div>

                <div>

                  <span>
                    {selectedExam.exam}
                  </span>

                  <strong>
                    {selectedLanguage.language}
                  </strong>

                </div>

              </div>

              <div className="section-heading">

                <span className="step-number">
                  3
                </span>

                <div>

                  <h2>
                    Select Paper
                  </h2>

                  <p>
                    Choose a previous year paper
                    to begin your test.
                  </p>

                </div>

              </div>

              <div className="paper-list">

                {papers.map(
                  (paper, index) => (
                    <button
                      key={index}
                      className="paper-card"
                      onClick={() =>
                        handlePaperSelect(
                          paper
                        )
                      }
                    >

                      <div className="paper-number">
                        {index + 1}
                      </div>

                      <div className="paper-info">

                        <h3>
                          {paper.name}
                        </h3>

                        <div className="paper-meta">

                          {paper.date && (
                            <span>
                              📅 {paper.date}
                            </span>
                          )}

                          {paper.shift && (
                            <span>
                              🕐 {paper.shift}
                            </span>
                          )}

                        </div>

                      </div>

                      <span className="paper-arrow">
                        →
                      </span>

                    </button>
                  )
                )}

              </div>

            </div>

          </section>
        )}

        {/* PAPER READY */}

        {selectedPaper &&
          !testStarted &&
          !testFinished && (
            <section className="paper-ready-section">

              <button
                className="back-link"
                onClick={() => {
                  setSelectedPaper(null);
                  setPaperData(null);
                }}
              >
                ← Back to Papers
              </button>

              {paperLoading ? (
                <div className="paper-loading">

                  <div className="loading-spinner"></div>

                  <p>
                    Loading paper...
                  </p>

                </div>
              ) : paperData ? (
                <div className="paper-ready-card">

                  <div className="ready-icon">
                    📝
                  </div>

                  <h1>
                    {selectedPaper.name}
                  </h1>

                  <p className="ready-subtitle">
                    {selectedExam.exam}
                  </p>

                  <div className="ready-details">

                    <div>
                      <span>
                        Questions
                      </span>

                      <strong>
                        {questions.length}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Duration
                      </span>

                      <strong>
                        {selectedExam.duration ||
                          90}{" "}
                        min
                      </strong>
                    </div>

                    <div>
                      <span>
                        Language
                      </span>

                      <strong>
                        {selectedLanguage.language}
                      </strong>
                    </div>

                  </div>

                  <div className="marking-info">

                    <h3>
                      Marking Scheme
                    </h3>

                    <p>
                      Correct answer:{" "}
                      <strong>
                        +
                        {
                          markingScheme.marksPerQuestion
                        }
                      </strong>
                    </p>

                    <p>
                      Wrong answer:{" "}
                      <strong>
                        {markingScheme.negativeMarking
                          ? `-${markingScheme.negativeMarksPerQuestion === 1 / 3 ? "1/3" : markingScheme.negativeMarksPerQuestion}`
                          : "0"}
                      </strong>
                    </p>

                    <p>
                      Unanswered:{" "}
                      <strong>
                        0
                      </strong>
                    </p>

                  </div>

                  <button
                    className="start-test-btn"
                    onClick={startTest}
                  >
                    Start Test →
                  </button>

                </div>
              ) : null}

            </section>
          )}

      </div>

    </div>
  );
}