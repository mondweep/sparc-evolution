import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

// Note: courseData should be imported from App.jsx or passed as props
const courseData = {
    quiz_answers: [
        { id: 1, question_id: 1, answer_text: 'To introduce non-linearity', is_correct: true, order_index: 1 },
        { id: 2, question_id: 1, answer_text: 'To reduce computation', is_correct: false, order_index: 2 },
        { id: 3, question_id: 1, answer_text: 'To store memory', is_correct: false, order_index: 3 },
        { id: 4, question_id: 1, answer_text: 'To increase speed', is_correct: false, order_index: 4 },
        { id: 5, question_id: 2, answer_text: 'XOR problem', is_correct: true, order_index: 1 },
        { id: 6, question_id: 2, answer_text: 'AND problem', is_correct: false, order_index: 2 },
        { id: 7, question_id: 2, answer_text: 'OR problem', is_correct: false, order_index: 3 },
        { id: 8, question_id: 2, answer_text: 'NOT problem', is_correct: false, order_index: 4 }
    ]
};

const QuizResult = ({ quiz, questions, answers, score, onRetake, onBack }) => {
    const passed = score >= quiz.passing_score;
    return (
        <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold mb-2 text-white">Quiz Results</h2>
                <p className="text-5xl font-extrabold my-6" style={{ color: passed ? '#4ade80' : '#f87171' }}>{score}%</p>
                <p className={`text-2xl font-semibold mb-6 ${passed ? 'text-green-400' : 'text-red-400'}`}>
                    {passed ? 'Congratulations, you passed!' : 'You did not pass. Keep studying!'}
                </p>
                <div className="my-8">
                    {questions.map(q => {
                        const userAnswerId = answers[q.id];
                        const correctAnswer = courseData.quiz_answers.find(a => a.question_id === q.id && a.is_correct);
                        const isCorrect = userAnswerId === correctAnswer.id;
                        return (
                            <div key={q.id} className="text-left p-4 mb-4 bg-gray-900 rounded-lg">
                                <p className="font-semibold text-gray-200">{q.question_text}</p>
                                <div className={`flex items-center mt-2 p-2 rounded ${isCorrect ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                                    {isCorrect ? <CheckCircle className="text-green-500 mr-2" /> : <XCircle className="text-red-500 mr-2" />}
                                    <p>Your answer: {courseData.quiz_answers.find(a => a.id === userAnswerId)?.answer_text || 'Not answered'}</p>
                                </div>
                                {!isCorrect && (
                                    <div className="flex items-center mt-2 p-2 rounded bg-green-900/50">
                                        <CheckCircle className="text-green-500 mr-2" />
                                        <p>Correct answer: {correctAnswer.answer_text}</p>
                                    </div>
                                )}
                                <p className="text-sm text-gray-400 mt-2 italic">{q.explanation}</p>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-center space-x-4">
                    <button onClick={onRetake} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg">Retake Quiz</button>
                    <button onClick={onBack} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">Back to Course</button>
                </div>
            </div>
        </div>
    );
};

export default QuizResult;