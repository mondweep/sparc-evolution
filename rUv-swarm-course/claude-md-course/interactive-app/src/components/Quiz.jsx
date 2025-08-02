import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, CheckCircle, XCircle } from 'lucide-react'

const Quiz = ({ onComplete, isCompleted }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const questions = [
    {
      id: 1,
      question: "What is the Golden Rule of Claude Flow?",
      options: [
        "Always use MCP tools for file operations",
        "One message equals all related operations",
        "Sequential execution is preferred",
        "TodoWrite should contain only one item"
      ],
      correct: 1
    },
    {
      id: 2,
      question: "How many todos should be included in a single TodoWrite call?",
      options: [
        "Exactly 1",
        "2-3 todos maximum",
        "5-10+ todos minimum",
        "It doesn't matter"
      ],
      correct: 2
    },
    {
      id: 3,
      question: "What is the role of MCP tools in Claude Flow?",
      options: [
        "Execute all file operations",
        "Generate code and run commands",
        "Coordinate and plan Claude Code's actions",
        "Replace Claude Code entirely"
      ],
      correct: 2
    }
  ]

  const handleAnswer = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }))
  }

  const submitQuiz = () => {
    setShowResults(true)
    const correctAnswers = questions.filter((q, index) => answers[index] === q.correct).length
    if (correctAnswers >= 2) {
      onComplete()
    }
  }

  const score = showResults ? questions.filter((q, index) => answers[index] === q.correct).length : 0
  const percentage = showResults ? Math.round((score / questions.length) * 100) : 0

  return (
    <div className="fade-in">
      <div className="module-header">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Award size={48} style={{ marginBottom: '20px' }} />
          <h1>Final Assessment</h1>
          <p>Test your Claude Flow configuration knowledge</p>
        </motion.div>
      </div>

      {!showResults ? (
        <div className="lesson-card">
          <h2>Quiz Questions</h2>
          {questions.map((question, qIndex) => (
            <div key={question.id} className="quiz-question">
              <h3>Question {qIndex + 1}: {question.question}</h3>
              <div className="quiz-options">
                {question.options.map((option, oIndex) => (
                  <button
                    key={oIndex}
                    className={`quiz-option ${answers[qIndex] === oIndex ? 'selected' : ''}`}
                    onClick={() => handleAnswer(qIndex, oIndex)}
                  >
                    {String.fromCharCode(65 + oIndex)}) {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <motion.button
              className="control-button"
              style={{ fontSize: '1.2em', padding: '15px 40px' }}
              onClick={submitQuiz}
              disabled={Object.keys(answers).length < questions.length}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Quiz
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="lesson-card">
          <h2>Quiz Results</h2>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ 
              fontSize: '3em', 
              fontWeight: 'bold',
              color: percentage >= 67 ? '#27ae60' : '#e74c3c',
              marginBottom: '10px'
            }}>
              {percentage}%
            </div>
            <div style={{ fontSize: '1.2em', marginBottom: '20px' }}>
              {score} out of {questions.length} correct
            </div>
            {percentage >= 67 ? (
              <div style={{ 
                color: '#27ae60',
                background: '#d4edda',
                padding: '20px',
                borderRadius: '8px',
                border: '2px solid #27ae60'
              }}>
                <CheckCircle size={32} style={{ marginBottom: '10px' }} />
                <div style={{ fontSize: '1.3em', fontWeight: 'bold' }}>
                  Congratulations! You've mastered Claude Flow configuration!
                </div>
              </div>
            ) : (
              <div style={{ 
                color: '#e74c3c',
                background: '#f8d7da',
                padding: '20px',
                borderRadius: '8px',
                border: '2px solid #e74c3c'
              }}>
                <XCircle size={32} style={{ marginBottom: '10px' }} />
                <div style={{ fontSize: '1.3em', fontWeight: 'bold' }}>
                  Review the course materials and try again
                </div>
              </div>
            )}
          </div>

          {/* Show correct answers */}
          <div>
            <h3>Answer Review</h3>
            {questions.map((question, qIndex) => (
              <div key={question.id} style={{ 
                margin: '20px 0',
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <h4>{question.question}</h4>
                <div style={{ marginTop: '10px' }}>
                  <span style={{ 
                    color: answers[qIndex] === question.correct ? '#27ae60' : '#e74c3c',
                    fontWeight: 'bold'
                  }}>
                    Your answer: {question.options[answers[qIndex]] || 'Not answered'}
                  </span>
                </div>
                <div style={{ 
                  color: '#27ae60',
                  fontWeight: 'bold',
                  marginTop: '5px'
                }}>
                  Correct answer: {question.options[question.correct]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Quiz