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


      {/* ================= ANDROID APP ================= */}
      <section className="app-promotion">

        {/* LEFT SIDE */}
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


          {/* FEATURES */}
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


          {/* GOOGLE PLAY BUTTON */}
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


        {/* RIGHT SIDE - PHONE */}
        <div className="app-promotion-visual">

          <div className="phone-mockup">

            {/* PHONE TOP SPEAKER */}
            <div className="phone-speaker"></div>

            {/* PHONE SCREEN */}
            <div className="phone-screen">

              <img
                src="https://raw.githubusercontent.com/dinu006/disxcity-data/main/image.jpeg"
                alt="Disxcity Android App"
              />

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;