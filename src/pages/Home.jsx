
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">

      {/* ================= HERO ================= */}
      <section className="hero">
        <span className="eyebrow">
          DISXCITY QUESTION BANK
        </span>

        <h1>
          Learn. Practice.
          <br />
          Test yourself.
        </h1>

        <p>
          Browse NCERT questions and previous year
          examination questions in one place.
        </p>

        <div className="hero-actions">
          <Link to="/ncert" className="primary-button">
            Browse NCERT
          </Link>

          <Link to="/pyq" className="secondary-button">
            Explore PYQs
          </Link>
        </div>
      </section>


      {/* ================= QUESTION CATEGORIES ================= */}
      <section className="home-grid">

        <Link to="/ncert" className="home-card">
          <span className="card-number">01</span>

          <h2>NCERT</h2>

          <p>
            Browse questions class-wise, subject-wise
            and chapter-wise.
          </p>

          <strong>
            Browse NCERT →
          </strong>
        </Link>

        <Link to="/pyq" className="home-card">
          <span className="card-number">02</span>

          <h2>Previous Year Questions</h2>

          <p>
            Practice questions from previous
            examination papers.
          </p>

          <strong>
            Browse PYQs →
          </strong>
        </Link>

      </section>


      {/* ================= WHY DISXCITY ================= */}
      <section className="why-section">

        <div className="section-heading">
          <span className="section-eyebrow">
            WHY DISXCITY
          </span>

          <h2>
            Everything you need
            <br />
            to practice better.
          </h2>

          <p>
            A simple question bank designed to help you
            practice consistently and understand where
            you need to improve.
          </p>
        </div>


        <div className="benefits-grid">

          <div className="benefit-card">
            <span className="benefit-icon">01</span>
            <h3>Organized Questions</h3>
            <p>
              Find questions easily by class, subject,
              chapter, exam and year.
            </p>
          </div>

          <div className="benefit-card">
            <span className="benefit-icon">02</span>
            <h3>Real Exam Practice</h3>
            <p>
              Practice previous year questions and become
              familiar with actual examination patterns.
            </p>
          </div>

          <div className="benefit-card">
            <span className="benefit-icon">03</span>
            <h3>Learn From Mistakes</h3>
            <p>
              Review your answers and use explanations
              to strengthen your understanding.
            </p>
          </div>

          <div className="benefit-card">
            <span className="benefit-icon">04</span>
            <h3>Practice Anywhere</h3>
            <p>
              Continue your preparation from your browser
              or take it with you using the Android app.
            </p>
          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="steps-section">

        <div className="section-heading centered">
          <span className="section-eyebrow">
            HOW IT WORKS
          </span>

          <h2>
            Start practicing
            <br />
            in three simple steps.
          </h2>
        </div>


        <div className="steps-grid">

          <div className="step">
            <span className="step-number">01</span>

            <h3>Choose your content</h3>

            <p>
              Select NCERT or previous year questions
              based on what you want to practice.
            </p>
          </div>

          <div className="step">
            <span className="step-number">02</span>

            <h3>Practice questions</h3>

            <p>
              Attempt questions and test your knowledge
              with focused practice.
            </p>
          </div>

          <div className="step">
            <span className="step-number">03</span>

            <h3>Improve your score</h3>

            <p>
              Identify mistakes, revise difficult topics
              and keep practicing.
            </p>
          </div>

        </div>

      </section>


      {/* ================= CONTENT COVERAGE ================= */}
      <section className="coverage-section">

        <div className="coverage-content">

          <span className="section-eyebrow">
            QUESTION COVERAGE
          </span>

          <h2>
            Practice by subject,
            <br />
            chapter and exam.
          </h2>

          <p>
            Find the questions you need without searching
            through hundreds of unrelated questions.
          </p>

          <div className="coverage-links">
            <Link to="/ncert">NCERT Questions →</Link>
            <Link to="/pyq">Previous Year Questions →</Link>
          </div>

        </div>


        <div className="coverage-list">

          <div className="coverage-item">
            <span>01</span>
            <div>
              <strong>NCERT</strong>
              <p>Class-wise & chapter-wise practice</p>
            </div>
          </div>

          <div className="coverage-item">
            <span>02</span>
            <div>
              <strong>Science</strong>
              <p>Concept-based questions and revision</p>
            </div>
          </div>

          <div className="coverage-item">
            <span>03</span>
            <div>
              <strong>General Knowledge</strong>
              <p>Useful questions for competitive exams</p>
            </div>
          </div>

          <div className="coverage-item">
            <span>04</span>
            <div>
              <strong>Previous Year Papers</strong>
              <p>Questions from real examinations</p>
            </div>
          </div>

        </div>

      </section>


      {/* ================= ANDROID APP ================= */}
      <section className="app-promotion">

        <div className="app-promotion-content">

          <span className="app-eyebrow">
            📱 DISXCITY ANDROID APP
          </span>

          <h2>
            Prepare for your exam
            <br />
            anywhere.
          </h2>

          <p>
            Take your exam preparation with you.
            Practice previous year questions,
            improve your speed and accuracy,
            and prepare smarter with the
            Disxcity Android app.
          </p>

          <div className="app-features">

            <div className="app-feature">
              <span>✓</span>
              <p>Previous Year Papers</p>
            </div>

            <div className="app-feature">
              <span>✓</span>
              <p>Real Exam-Level Questions</p>
            </div>

            <div className="app-feature">
              <span>✓</span>
              <p>Practice Anywhere</p>
            </div>

          </div>


          <a
            href="https://play.google.com/store/apps/details?id=com.dinesh.disxcity&pli=1"
            target="_blank"
            rel="noopener noreferrer"
            className="play-store-button"
          >
            <span className="play-icon">
              ▶
            </span>

            <span className="play-text">
              <small>GET IT ON</small>
              <strong>Google Play</strong>
            </span>
          </a>

        </div>


        <div className="app-promotion-visual">

          <div className="phone-mockup">

            <div className="phone-speaker"></div>

            <div className="phone-screen">

              <img
                src="https://raw.githubusercontent.com/dinu006/disxcity-data/main/image.jpeg"
                alt="Disxcity Android App"
              />

            </div>

          </div>

        </div>

      </section>


      {/* ================= FAQ ================= */}
      <section className="faq-section">

        <div className="section-heading centered">

          <span className="section-eyebrow">
            FAQ
          </span>

          <h2>
            Frequently asked
            <br />
            questions.
          </h2>

        </div>


        <div className="faq-list">

          <details>
            <summary>
              What is Disxcity?
              <span>+</span>
            </summary>

            <p>
              Disxcity is a question bank where students
              can practice NCERT questions and previous
              year examination questions.
            </p>
          </details>


          <details>
            <summary>
              Can I practice NCERT questions?
              <span>+</span>
            </summary>

            <p>
              Yes. You can browse NCERT questions
              according to class, subject and chapter.
            </p>
          </details>


          <details>
            <summary>
              Can I practice previous year questions?
              <span>+</span>
            </summary>

            <p>
              Yes. The PYQ section allows you to practice
              questions from previous examination papers.
            </p>
          </details>


          <details>
            <summary>
              Is there an Android app?
              <span>+</span>
            </summary>

            <p>
              Yes. You can download the Disxcity Android
              app from Google Play and continue your
              preparation on your phone.
            </p>
          </details>

        </div>

      </section>


      {/* ================= FINAL CTA ================= */}
      <section className="final-cta">

        <span className="section-eyebrow">
          START TODAY
        </span>

        <h2>
          Ready to start
          <br />
          practicing?
        </h2>

        <p>
          Choose a question bank and start improving
          your preparation today.
        </p>

        <div className="hero-actions">

          <Link to="/ncert" className="primary-button">
            Browse NCERT
          </Link>

          <Link to="/pyq" className="secondary-button">
            Explore PYQs
          </Link>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="footer">

        <div className="footer-main">

          <div className="footer-brand">

            <h2>DISXCITY</h2>

            <p>
              Practice smarter. Prepare better.
            </p>

          </div>


          <div className="footer-column">

            <h3>Explore</h3>

            <Link to="/ncert">
              NCERT
            </Link>

            <Link to="/pyq">
              Previous Year Questions
            </Link>

          </div>


          <div className="footer-column">

            <h3>App</h3>

            <a
              href="https://play.google.com/store/apps/details?id=com.dinesh.disxcity&pli=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Play
            </a>

          </div>


          <div className="footer-column">

            <h3>Quick Links</h3>

            <Link to="/">
              Home
            </Link>

            <a href="#faq">
              FAQ
            </a>

          </div>

        </div>


        <div className="footer-bottom">

          <span>
            © {new Date().getFullYear()} Disxcity. All rights reserved.
          </span>

          <span>
            Built for better exam preparation.
          </span>

        </div>

      </footer>

    </div>
  );
}

export default Home;
