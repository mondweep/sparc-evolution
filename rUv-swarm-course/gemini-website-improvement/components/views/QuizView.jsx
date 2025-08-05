import React, { useState, useContext } from 'react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';

// Remove hardcoded courseData - now using AppContext

const QuizView = () => {
    const { selectedQuizId, setView, setSelectedCourseId, currentUser, courseData } = useContext(AppContext);
    
    if (!courseData || !courseData.quizzes || !selectedQuizId) {
        return (
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
                <p>No quiz selected</p>
            </div>
        );
    }
    
    const quiz = courseData.quizzes.find(q => q.id === selectedQuizId);
    if (!quiz) {
        return (
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
                <p>Quiz not found</p>
            </div>
        );
    }
    
    const questions = courseData.quiz_questions ? courseData.quiz_questions.filter(q => q.quiz_id === quiz.id).sort((a, b) => a.order_index - b.order_index) : [];
    const module = courseData.modules ? courseData.modules.find(m => m.id === quiz.module_id) : null;
    const course = module && courseData.courses ? courseData.courses.find(c => c.id === module.course_id) : null;

    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleAnswerChange = (questionId, answerId) => {
        setAnswers(prev => ({ ...prev, [questionId]: answerId }));
    };

    const handleSubmit = () => {
        let correctAnswers = 0;
        let totalPoints = 0;
        questions.forEach(q => {
            totalPoints += q.points;
            if (courseData.quiz_answer_options) {
                const correctAnswer = courseData.quiz_answer_options.find(a => a.question_id === q.id && a.is_correct);
                if (correctAnswer && answers[q.id] === correctAnswer.id) {
                    correctAnswers += q.points;
                }
            }
        });
        setScore(Math.round((correctAnswers / totalPoints) * 100));
        setSubmitted(true);
    };

    const goToCourseView = () => {
        if (course) {
            setSelectedCourseId(course.id);
        }
        setView('course');
    };

    if (submitted) {
        return <QuizResult quiz={quiz} questions={questions} answers={answers} score={score} onRetake={() => { setSubmitted(false); setAnswers({}); setScore(0); }} onBack={goToCourseView} />;
    }

    return (
        <div className="max-w-3xl mx-auto">
             <button onClick={goToCourseView} className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-6">
                <ArrowLeft size={20} />
                <span>Back to Course</span>
            </button>
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold mb-2 text-white">{quiz.title}</h2>
                <p className="text-gray-400 mb-6">{quiz.description}</p>
                <div className="space-y-8">
                    {questions.map((q, index) => (
                        <div key={q.id} className="border-t border-gray-700 pt-6">
                            <p className="font-semibold text-lg mb-4 text-gray-200">{index + 1}. {q.question_text}</p>
                            <div className="space-y-3">
                                {courseData.quiz_answer_options ? courseData.quiz_answer_options.filter(a => a.question_id === q.id).map(ans => (
                                    <label key={ans.id} className="flex items-center p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                                        <input type="radio" name={`q-${q.id}`} value={ans.id} checked={answers[q.id] === ans.id} onChange={() => handleAnswerChange(q.id, ans.id)} className="mr-4 w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500" />
                                        <span>{ans.option_text}</span>
                                    </label>
                                )) : []}
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={handleSubmit} className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors">
                    Submit Answers
                </button>
            </div>
        </div>
    );
};

import QuizResult from './QuizResult.jsx';

export default QuizView;