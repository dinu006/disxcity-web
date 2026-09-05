import { useEffect, useMemo, useState } from "react";
import {
    getNcertIndex,
    getNcertChapter,
} from "../services/questionApi";

import QuestionCard from "../components/QuestionCard";
import "./Ncert.css";

function Ncert() {
    const [index, setIndex] = useState([]);

    const [level, setLevel] = useState("class");

    const [selectedClass, setSelectedClass] = useState("");
    const [selectedLanguage, setSelectedLanguage] =
        useState("");
    const [selectedYear, setSelectedYear] =
        useState("");
    const [selectedSubject, setSelectedSubject] =
        useState("");

    const [chapter, setChapter] = useState(null);
    const [chapterData, setChapterData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [chapterLoading, setChapterLoading] =
        useState(false);
    const [error, setError] = useState("");

    // =========================================================
    // LOAD NCERT INDEX
    // =========================================================

    useEffect(() => {
        async function load() {
            try {
                const result = await getNcertIndex();

                setIndex(result?.ncert || []);
            } catch (error) {
                console.error(error);
                setError("Unable to load NCERT data.");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    // =========================================================
    // CLASSES
    // =========================================================

    const classes = useMemo(
        () =>
            [...new Set(index.map((item) => item.class))],
        [index]
    );

    // =========================================================
    // LANGUAGES
    // =========================================================

    const languages = useMemo(
        () =>
            [
                ...new Set(
                    index
                        .filter(
                            (item) =>
                                item.class === selectedClass
                        )
                        .map((item) => item.language)
                ),
            ],
        [index, selectedClass]
    );

    // =========================================================
    // YEARS
    // =========================================================

    const years = useMemo(
        () =>
            [
                ...new Set(
                    index
                        .filter(
                            (item) =>
                                item.class === selectedClass &&
                                item.language ===
                                    selectedLanguage
                        )
                        .map((item) => item.year)
                ),
            ],
        [index, selectedClass, selectedLanguage]
    );

    // =========================================================
    // SUBJECTS
    // =========================================================

    const subjects = useMemo(
        () =>
            [
                ...new Set(
                    index
                        .filter(
                            (item) =>
                                item.class === selectedClass &&
                                item.language ===
                                    selectedLanguage &&
                                item.year === selectedYear
                        )
                        .map((item) => item.subject)
                ),
            ],
        [
            index,
            selectedClass,
            selectedLanguage,
            selectedYear,
        ]
    );

    // =========================================================
    // SELECTED ENTRY
    // =========================================================

    const selectedEntry = useMemo(
        () =>
            index.find(
                (item) =>
                    item.class === selectedClass &&
                    item.language === selectedLanguage &&
                    item.year === selectedYear &&
                    item.subject === selectedSubject
            ),
        [
            index,
            selectedClass,
            selectedLanguage,
            selectedYear,
            selectedSubject,
        ]
    );

    // =========================================================
    // RESET
    // =========================================================

    function reset() {
        setLevel("class");

        setSelectedClass("");
        setSelectedLanguage("");
        setSelectedYear("");
        setSelectedSubject("");

        setChapter(null);
        setChapterData(null);
        setError("");
    }

    // =========================================================
    // OPEN CHAPTER
    // =========================================================

    async function openChapter(item) {
        try {
            setChapter(item);
            setChapterLoading(true);
            setChapterData(null);
            setError("");

            const result = await getNcertChapter(
                item.file
            );

            setChapterData(result);
        } catch (error) {
            console.error(error);

            setError(
                "Unable to load questions for this chapter."
            );
        } finally {
            setChapterLoading(false);
        }
    }

    // =========================================================
    // BACK
    // =========================================================

    function back() {
        // Chapter → Subject / Chapters
        if (chapter) {
            setChapter(null);
            setChapterData(null);
            setError("");
            return;
        }

        // Subject → Year
        if (level === "subject") {
            setLevel("year");
            setSelectedSubject("");
            return;
        }

        // Year → Language
        if (level === "year") {
            setLevel("language");
            setSelectedYear("");
            return;
        }

        // Language → Class
        if (level === "language") {
            setLevel("class");
            setSelectedLanguage("");
        }
    }

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div className="ncert-selection-page">
                <div className="ncert-container">
                    <Loading text="Loading NCERT..." />
                </div>
            </div>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (error && !chapterData) {
        return (
            <div className="ncert-selection-page">
                <div className="ncert-container">
                    <ErrorBox message={error} />
                </div>
            </div>
        );
    }

    // =========================================================
    // CHAPTER QUESTIONS
    // =========================================================

    if (chapter) {
        if (chapterLoading) {
            return (
                <div className="ncert-selection-page">
                    <div className="ncert-container">
                        <button
                            className="ncert-back-button"
                            onClick={back}
                        >
                            ← Back
                        </button>

                        <Loading text="Loading questions..." />
                    </div>
                </div>
            );
        }

        return (
            <div className="ncert-question-page">
                <div className="ncert-container">

                    <button
                        className="ncert-back-button"
                        onClick={back}
                    >
                        ← Chapters
                    </button>

                    <div className="ncert-question-header">
                        <div>
                            <span className="ncert-eyebrow">
                                NCERT / {selectedSubject}
                            </span>

                            <h1>
                                {chapterData?.chapter ||
                                    chapter.name}
                            </h1>

                            <p>
                                {selectedClass}
                                {" · "}
                                {selectedLanguage}
                                {" · "}
                                {selectedYear}
                            </p>
                        </div>

                        <div className="ncert-question-count">
                            <strong>
                                {chapterData?.questions
                                    ?.length || 0}
                            </strong>

                            <span>Questions</span>
                        </div>
                    </div>

                    {error && (
                        <ErrorBox message={error} />
                    )}

                    <div className="ncert-questions-container">
                        {chapterData?.questions?.map(
                            (question, index) => (
                                <QuestionCard
                                    key={
                                        question.id ??
                                        index
                                    }
                                    question={question}
                                    number={index + 1}
                                    interactive={true}
                                />
                            )
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================
    // CHAPTER SELECTION
    // =========================================================

    if (level === "subject") {
        const chapters =
            selectedEntry?.chapters || [];

        return (
            <SelectionPage
                label="NCERT"
                title="Select Chapter"
                subtitle={`${selectedClass} · ${selectedLanguage} · ${selectedYear} · ${selectedSubject}`}
                onBack={back}
            >
                <div className="ncert-card-list">
                    {chapters.map((item, index) => (
                        <button
                            key={item.file}
                            className="ncert-list-card"
                            onClick={() =>
                                openChapter(item)
                            }
                        >
                            <div className="ncert-card-icon">
                                <span>
                                    {String(index + 1).padStart(
                                        2,
                                        "0"
                                    )}
                                </span>
                            </div>

                            <div className="ncert-card-content">
                                <strong>
                                    {item.name}
                                </strong>

                                <span>
                                    Chapter
                                </span>
                            </div>

                            <span className="ncert-card-arrow">
                                →
                            </span>
                        </button>
                    ))}
                </div>
            </SelectionPage>
        );
    }

    // =========================================================
    // SUBJECT SELECTION
    // =========================================================

    if (level === "year") {
        return (
            <SelectionPage
                label="NCERT"
                title="Select Subject"
                subtitle={`${selectedClass} · ${selectedLanguage} · ${selectedYear}`}
                onBack={back}
            >
                <div className="ncert-card-list">
                    {subjects.map((subject, index) => (
                        <button
                            key={subject}
                            className="ncert-list-card"
                            onClick={() => {
                                setSelectedSubject(
                                    subject
                                );
                                setLevel("subject");
                            }}
                        >
                            <div className="ncert-card-icon">
                                <span>
                                    {String(index + 1).padStart(
                                        2,
                                        "0"
                                    )}
                                </span>
                            </div>

                            <div className="ncert-card-content">
                                <strong>
                                    {subject}
                                </strong>

                                <span>
                                    Subject
                                </span>
                            </div>

                            <span className="ncert-card-arrow">
                                →
                            </span>
                        </button>
                    ))}
                </div>
            </SelectionPage>
        );
    }

    // =========================================================
    // YEAR SELECTION
    // =========================================================

    if (level === "language") {
        return (
            <SelectionPage
                label="NCERT"
                title="Select Year"
                subtitle={`${selectedClass} · ${selectedLanguage}`}
                onBack={back}
            >
                <div className="ncert-card-list">
                    {years.map((year, index) => (
                        <button
                            key={year}
                            className="ncert-list-card"
                            onClick={() => {
                                setSelectedYear(year);
                                setLevel("year");
                            }}
                        >
                            <div className="ncert-card-icon">
                                <span>
                                    {String(index + 1).padStart(
                                        2,
                                        "0"
                                    )}
                                </span>
                            </div>

                            <div className="ncert-card-content">
                                <strong>
                                    {year}
                                </strong>

                                <span>
                                    Academic Year
                                </span>
                            </div>

                            <span className="ncert-card-arrow">
                                →
                            </span>
                        </button>
                    ))}
                </div>
            </SelectionPage>
        );
    }

    // =========================================================
    // CLASS / LANGUAGE
    // =========================================================

    if (level === "class") {
        // Language selection
        if (selectedClass) {
            return (
                <SelectionPage
                    label="NCERT"
                    title="Select Language"
                    subtitle={selectedClass}
                    onBack={reset}
                >
                    <div className="ncert-card-list">
                        {languages.map(
                            (language, index) => (
                                <button
                                    key={language}
                                    className="ncert-list-card"
                                    onClick={() => {
                                        setSelectedLanguage(
                                            language
                                        );
                                        setLevel(
                                            "language"
                                        );
                                    }}
                                >
                                    <div className="ncert-card-icon ncert-language-icon">
                                        🌐
                                    </div>

                                    <div className="ncert-card-content">
                                        <strong>
                                            {language}
                                        </strong>

                                        <span>
                                            Language
                                        </span>
                                    </div>

                                    <span className="ncert-card-arrow">
                                        →
                                    </span>
                                </button>
                            )
                        )}
                    </div>
                </SelectionPage>
            );
        }

        // Class selection
        return (
            <SelectionPage
                label="NCERT QUESTION BANK"
                title="Select Class"
                subtitle="Choose a class to browse the NCERT question bank."
                onBack={null}
            >
                <div className="ncert-card-list">
                    {classes.map(
                        (className, index) => (
                            <button
                                key={className}
                                className="ncert-list-card"
                                onClick={() =>
                                    setSelectedClass(
                                        className
                                    )
                                }
                            >
                                <div className="ncert-card-icon">
                                    <span>
                                        {String(
                                            index + 1
                                        ).padStart(
                                            2,
                                            "0"
                                        )}
                                    </span>
                                </div>

                                <div className="ncert-card-content">
                                    <strong>
                                        {className.replace(
                                            "Class-",
                                            "Class "
                                        )}
                                    </strong>

                                    <span>
                                        Class
                                    </span>
                                </div>

                                <span className="ncert-card-arrow">
                                    →
                                </span>
                            </button>
                        )
                    )}
                </div>
            </SelectionPage>
        );
    }

    return null;
}

// =========================================================
// SELECTION PAGE
// =========================================================

function SelectionPage({
    label,
    title,
    subtitle,
    onBack,
    children,
}) {
    return (
        <div className="ncert-selection-page">
            <div className="ncert-container">

                {onBack && (
                    <button
                        className="ncert-back-button"
                        onClick={onBack}
                    >
                        ← Back
                    </button>
                )}

                <div className="ncert-selection-heading">
                    <span className="ncert-selection-label">
                        {label}
                    </span>

                    <h1>{title}</h1>

                    <p>{subtitle}</p>
                </div>

                {children}
            </div>
        </div>
    );
}

// =========================================================
// LOADING
// =========================================================

function Loading({ text }) {
    return (
        <div className="ncert-loading-box">
            <div className="ncert-spinner" />

            <p>{text}</p>
        </div>
    );
}

// =========================================================
// ERROR
// =========================================================

function ErrorBox({ message }) {
    return (
        <div className="ncert-error-box">
            {message}
        </div>
    );
}

export default Ncert;