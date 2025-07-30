import React, { useState, useContext } from 'react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';

// Note: courseData should be imported from App.jsx or passed as props
const courseData = {
    users: [
        { id: 1, username: 'admin', email: 'admin@ruv-swarm.edu', firstName: 'System', lastName: 'Administrator', role: 'admin', bio: 'System administrator for the rUv-swarm learning platform.' },
        { id: 2, username: 'dr_neuralnet', email: 'instructor@ruv-swarm.edu', firstName: 'Dr. Elena', lastName: 'NetworkWeaver', role: 'instructor', bio: 'AI researcher specializing in swarm intelligence and neural networks. PhD in Computer Science from MIT.' },
        { id: 3, username: 'alex_student', email: 'alex@student.edu', firstName: 'Alex', lastName: 'Learner', role: 'student', bio: 'Computer Science student passionate about AI and distributed systems.' },
        { id: 4, username: 'sarah_dev', email: 'sarah@developer.com', firstName: 'Sarah', lastName: 'Developer', role: 'student', bio: 'Full-stack developer exploring AI/ML applications.' },
        { id: 5, username: 'mike_researcher', email: 'mike@research.org', firstName: 'Mike', lastName: 'Researcher', role: 'student', bio: 'Research scientist investigating evolutionary algorithms.' }
    ],
    courses: [
        { id: 1, title: 'rUv-swarm Foundations', slug: 'ruv-swarm-foundations', level: 'foundations', duration_hours: 8, difficulty: 1, description: 'Master the fundamental concepts of swarm intelligence and neural networks. This course introduces you to the revolutionary approach of ephemeral intelligence through lightweight, temporary neural networks orchestrated in swarms.', prerequisites: 'Basic programming knowledge. Familiarity with C is helpful but not required.', learning_objectives: '• Understand the core concepts of neural networks and activation functions\n• Grasp the XOR problem and why it demonstrates non-linear separability\n• Learn swarm intelligence principles and emergence\n• Master Particle Swarm Optimization (PSO) fundamentals\n• Execute and analyze rUv-swarm programs from the command line', thumbnail_url: 'https://placehold.co/600x400/1e40af/ffffff?text=Foundations', is_published: true, instructor_id: 2 },
        { id: 2, title: 'rUv-swarm Practitioner', slug: 'ruv-swarm-practitioner', level: 'practitioner', duration_hours: 16, difficulty: 3, description: 'Deep dive into the rUv-swarm codebase and learn to modify and extend the system. Master the FANN library, understand PSO implementation, and build your own neural network solutions.', prerequisites: 'Completion of rUv-swarm Foundations. Strong C programming skills required.', learning_objectives: '• Master the FANN (Fast Artificial Neural Network) library\n• Analyze and modify the rUv-swarm source code\n• Understand PSO implementation details and parameters\n• Tune hyperparameters for optimal performance\n• Adapt the system for new datasets and problems', thumbnail_url: 'https://placehold.co/600x400/be123c/ffffff?text=Practitioner', is_published: true, instructor_id: 2 },
        { id: 3, title: 'rUv-swarm Architect', slug: 'ruv-swarm-architect', level: 'architect', duration_hours: 24, difficulty: 5, description: 'Design and implement advanced swarm intelligence systems. Learn to extend rUv-swarm with new optimization algorithms, deploy containerized solutions, and architect distributed cognitive systems.', prerequisites: 'Completion of rUv-swarm Practitioner. Advanced programming and system design experience.', learning_objectives: '• Implement alternative optimization algorithms (GA, ACO)\n• Design modular, extensible AI architectures\n• Containerize and deploy rUv-swarm applications\n• Architect solutions for complex, real-world problems\n• Create comprehensive AI system documentation', thumbnail_url: 'https://placehold.co/600x400/047857/ffffff?text=Architect', is_published: true, instructor_id: 2 }
    ],
    modules: [
        // Foundations
        { id: 1, course_id: 1, title: 'Introduction to Neural Networks', slug: 'intro-neural-networks', description: 'Understand the building blocks of artificial intelligence', order_index: 1, duration_minutes: 90 },
        { id: 2, course_id: 1, title: 'The XOR Problem', slug: 'xor-problem', description: 'The classic test case that proves the power of neural networks', order_index: 2, duration_minutes: 75 },
        { id: 3, course_id: 1, title: 'Introduction to Swarm Intelligence', slug: 'swarm-intelligence', description: 'How simple agents create complex intelligent behavior', order_index: 3, duration_minutes: 85 },
        { id: 4, course_id: 1, title: 'Particle Swarm Optimization Fundamentals', slug: 'pso-fundamentals', description: 'Master the core algorithm behind rUv-swarm', order_index: 4, duration_minutes: 100 },
        { id: 5, course_id: 1, title: 'Hands-On: Running rUv-swarm', slug: 'hands-on-ruv-swarm', description: 'Execute and analyze rUv-swarm programs', order_index: 5, duration_minutes: 120 },
        // Practitioner
        { id: 6, course_id: 2, title: 'Deep Dive: The FANN Library', slug: 'fann-library-deep-dive', description: 'Master the Fast Artificial Neural Network library', order_index: 1, duration_minutes: 180 },
        { id: 7, course_id: 2, title: 'Code Walkthrough: fann_utils.c', slug: 'fann-utils-walkthrough', description: 'Analyze the rUv-swarm FANN wrapper functions', order_index: 2, duration_minutes: 120 },
        // Architect
        { id: 8, course_id: 3, title: 'Advanced Optimization Algorithms', slug: 'advanced-optimization', description: 'Beyond PSO: GA, ACO, and hybrid approaches', order_index: 1, duration_minutes: 150 }
    ],
    quizzes: [
        { id: 1, module_id: 1, title: 'Neural Networks Basics Quiz', description: 'Test your understanding of fundamental concepts', time_limit_minutes: 15, passing_score: 70 },
        { id: 2, module_id: 2, title: 'XOR Problem Quiz', description: 'Verify your grasp of the XOR challenge', time_limit_minutes: 10, passing_score: 80 }
    ],
    quiz_questions: [
        { id: 1, quiz_id: 1, question_text: 'What is the primary function of an activation function in a neural network?', points: 10, order_index: 1, explanation: 'Activation functions introduce non-linearity to the network, allowing it to learn complex patterns.' },
        { id: 2, quiz_id: 1, question_text: 'Which problem demonstrates why neural networks need hidden layers?', points: 10, order_index: 2, explanation: 'The XOR problem cannot be solved by a single-layer perceptron because it is not linearly separable.' }
    ],
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

const QuizView = () => {
    const { selectedQuizId, setView, setSelectedCourseId, currentUser } = useContext(AppContext);
    const quiz = courseData.quizzes.find(q => q.id === selectedQuizId);
    const questions = courseData.quiz_questions.filter(q => q.quiz_id === quiz.id).sort((a, b) => a.order_index - b.order_index);
    const module = courseData.modules.find(m => m.id === quiz.module_id);
    const course = courseData.courses.find(c => c.id === module.course_id);

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
            const correctAnswer = courseData.quiz_answers.find(a => a.question_id === q.id && a.is_correct);
            if (answers[q.id] === correctAnswer.id) {
                correctAnswers += q.points;
            }
        });
        setScore(Math.round((correctAnswers / totalPoints) * 100));
        setSubmitted(true);
    };

    const goToCourseView = () => {
        setSelectedCourseId(course.id);
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
                                {courseData.quiz_answers.filter(a => a.question_id === q.id).sort((a,b) => a.order_index - b.order_index).map(ans => (
                                    <label key={ans.id} className="flex items-center p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                                        <input type="radio" name={`q-${q.id}`} value={ans.id} onChange={() => handleAnswerChange(q.id, ans.id)} className="mr-4 w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500" />
                                        <span>{ans.answer_text}</span>
                                    </label>
                                ))}
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

export { QuizView, QuizResult };