import { useState } from "react";

function QuestionCard({
    question,
    number,
    showAnswerByDefault = false,
    interactive = false,
}) {
    const [selectedAnswer, setSelectedAnswer] =
        useState(null);

    const [checked, setChecked] = useState(
        showAnswerByDefault
    );

    const letters = ["A", "B", "C", "D"];

    const correctIndex = Number(
        question.correctAnswer
    );

    function handleOptionClick(index) {
        if (checked) return;

        setSelectedAnswer(index);
    }

    function handleCheckAnswer() {
        if (selectedAnswer === null) return;

        setChecked(true);
    }

    function handleTryAgain() {
        setSelectedAnswer(null);
        setChecked(false);
    }

    // Create a detailed prompt for AI
    function createAIPrompt() {
        const options = question.options
            ?.map(
                (option, index) =>
                    `${letters[index]}. ${option}`
            )
            .join("\n");

        const selected =
            selectedAnswer !== null
                ? `${letters[selectedAnswer]}. ${question.options?.[selectedAnswer]
                }`
                : "No answer selected";

        const correct = `${letters[correctIndex]}. ${question.options?.[correctIndex]
            }`;

        return `I am preparing for an exam. Please explain this MCQ in a simple and detailed way.

Question:
${question.question}

Options:
${options}

My selected answer:
${selected}

Correct answer:
${correct}

Existing explanation:
${question.explanation || "Not provided"}

Please provide:
1. Why the correct answer is correct.
2. Why each other option is incorrect.
3. A simple concept explanation.
4. An easy trick/memory tip to remember the answer.
5. Keep the explanation suitable for a competitive exam student.`;
    }

    // Open ChatGPT
    async function askChatGPT() {
        const prompt = createAIPrompt();

        // Copy prompt so it is always available
        try {
            await navigator.clipboard.writeText(prompt);
        } catch (error) {
            console.log("Clipboard unavailable");
        }

        const url =
            "https://chatgpt.com/?q=" +
            encodeURIComponent(prompt);

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );
    }



    return (
        <article className="question-card">

            {/* Question Header */}
            <div className="question-meta">
                <span>Question {number}</span>

                {question.id !== undefined && (
                    <span className="muted">
                        ID: {question.id}
                    </span>
                )}
            </div>

            {/* Question */}
            <h2 className="question-text">
                {question.question}
            </h2>

            {/* Options */}
            <div className="options">
                {question.options?.map(
                    (option, index) => {
                        const isSelected =
                            selectedAnswer === index;

                        const isCorrect =
                            index === correctIndex;

                        const isWrongSelected =
                            checked &&
                            isSelected &&
                            !isCorrect;

                        let optionClass = "option";

                        if (isSelected && !checked) {
                            optionClass += " selected";
                        }

                        if (checked && isCorrect) {
                            optionClass += " correct";
                        }

                        if (isWrongSelected) {
                            optionClass += " wrong";
                        }

                        return (
                            <button
                                key={index}
                                type="button"
                                className={optionClass}
                                onClick={() =>
                                    handleOptionClick(index)
                                }
                                disabled={checked}
                            >
                                <span className="option-letter">
                                    {letters[index]}
                                </span>

                                <span className="option-text">
                                    {option}
                                </span>

                                {checked && isCorrect && (
                                    <span className="correct-label">
                                        ✓ Correct
                                    </span>
                                )}

                                {isWrongSelected && (
                                    <span className="wrong-label">
                                        ✕ Wrong
                                    </span>
                                )}
                            </button>
                        );
                    }
                )}
            </div>

            {/* Check Answer */}
            {interactive && !checked && (
                <button
                    type="button"
                    className="primary-button"
                    disabled={selectedAnswer === null}
                    onClick={handleCheckAnswer}
                >
                    ✓ Check Answer
                </button>
            )}

            {/* Result */}
            {interactive &&
                checked &&
                selectedAnswer !== null && (
                    <div
                        className={
                            selectedAnswer === correctIndex
                                ? "answer-result correct-result"
                                : "answer-result wrong-result"
                        }
                    >
                        {selectedAnswer === correctIndex ? (
                            <>
                                <strong>
                                    ✓ Correct Answer!
                                </strong>

                                <p>
                                    Well done! You selected the
                                    correct answer.
                                </p>
                            </>
                        ) : (
                            <>
                                <strong>
                                    ✕ Incorrect Answer
                                </strong>

                                <p>
                                    Correct answer:{" "}
                                    <strong>
                                        {letters[correctIndex]}.{" "}
                                        {question.options?.[
                                            correctIndex
                                        ]}
                                    </strong>
                                </p>
                            </>
                        )}
                    </div>
                )}

            {/* Explanation */}
            {checked && (
                <div className="explanation">
                    <strong>
                        Answer:{" "}
                        {letters[correctIndex] || "—"}
                    </strong>

                    {question.options?.[correctIndex] && (
                        <p className="answer-text">
                            {question.options[correctIndex]}
                        </p>
                    )}

                    {question.explanation && (
                        <>
                            <strong>Explanation</strong>

                            <p>
                                {question.explanation}
                            </p>
                        </>
                    )}
                </div>
            )}

            {/* Bottom Actions */}
            {interactive && checked && (
                <div className="question-actions">

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={handleTryAgain}
                    >
                        ↻ Try Again
                    </button>

                    <button
                        type="button"
                        className="ai-button chatgpt-button"
                        onClick={askChatGPT}
                    >
                        ✦ Ask ChatGPT
                    </button>

                </div>
            )}

            {/* Non-interactive mode */}
            {!interactive && !checked && (
                <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setChecked(true)}
                >
                    Show Answer
                </button>
            )}

        </article>
    );
}

export default QuestionCard;