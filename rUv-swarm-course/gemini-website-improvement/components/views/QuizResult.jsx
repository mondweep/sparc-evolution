import React, { useContext } from 'react';
import { CheckCircle, XCircle, Trophy, ArrowLeft } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';

const QuizResult = ({ quiz, questions, answers, score, onRetake, onBack }) => {
    const { courseData } = useContext(AppContext);
    const passingScore = quiz.passing_score || 70;
    const passed = score >= passingScore;
    const scorePercentage = score;

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={onBack} className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-6">
                <ArrowLeft size={20} />
                <span>Back to Quiz</span>
            </button>
            
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    {passed ? (
                        <div className="text-green-400">
                            <Trophy size={64} className="mx-auto mb-4" />
                            <h2 className="text-4xl font-extrabold mb-2">Congratulations!</h2>
                            <p className="text-xl">You passed the quiz!</p>
                        </div>
                    ) : (
                        <div className="text-red-400">
                            <XCircle size={64} className="mx-auto mb-4" />
                            <h2 className="text-4xl font-extrabold mb-2">Keep Learning!</h2>
                            <p className="text-xl">You can retake this quiz.</p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-900 p-6 rounded-lg text-center">
                        <h3 className="text-2xl font-bold text-blue-300 mb-2">Your Score</h3>
                        <p className="text-4xl font-extrabold text-white">{score}%</p>
                        <p className="text-gray-400">{scorePercentage}%</p>
                    </div>
                    <div className="bg-gray-900 p-6 rounded-lg text-center">
                        <h3 className="text-2xl font-bold text-blue-300 mb-2">Passing Score</h3>
                        <p className="text-4xl font-extrabold text-white">{passingScore}%</p>
                    </div>
                    <div className="bg-gray-900 p-6 rounded-lg text-center">
                        <h3 className="text-2xl font-bold text-blue-300 mb-2">Status</h3>
                        <div className={`text-2xl font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>
                            {passed ? 'PASSED' : 'FAILED'}
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-4 text-blue-300">Review Your Answers</h3>
                    <div className="space-y-4">
                        {questions.map((question, index) => {
                            const userAnswerId = answers[question.id];
                            const userAnswer = courseData.quiz_answer_options?.find(a => a.id === userAnswerId);
                            const isCorrect = userAnswer?.is_correct || false;
                            
                            return (
                                <div key={question.id} className="bg-gray-900 p-6 rounded-lg">
                                    <div className="flex items-start space-x-3 mb-4">
                                        {isCorrect ? (
                                            <CheckCircle className="text-green-400 mt-1" size={20} />
                                        ) : (
                                            <XCircle className="text-red-400 mt-1" size={20} />
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-bold text-white mb-2">
                                                Question {index + 1}: {question.question_text}
                                            </h4>
                                            <p className={`mb-2 ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                                                Your answer: {userAnswer?.option_text || 'No answer selected'}
                                            </p>
                                            {!isCorrect && (
                                                <p className="text-green-300 mb-2">
                                                    Correct answer: {courseData.quiz_answer_options?.find(a => a.question_id === question.id && a.is_correct)?.option_text}
                                                </p>
                                            )}
                                            <p className="text-gray-400 text-sm">
                                                {userAnswer?.explanation || 'No explanation available'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-center space-x-4">
                    <button onClick={onRetake} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">
                        Retake Quiz
                    </button>
                    <button onClick={onBack} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg">
                        Back to Course
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizResult;