import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { CodeExercise } from '../exercises/index.js';
import MarkdownRenderer from '../MarkdownRenderer.jsx';

// Remove hardcoded courseData - now using AppContext

// Markdown rendering now handled by MarkdownRenderer component


const LessonView = () => {
    const { selectedLessonId, setView, setSelectedLessonId, setSelectedCourseId, courseData } = useContext(AppContext);
    
    if (!courseData || !courseData.lessons || !selectedLessonId) {
        return (
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
                <p>No lesson selected</p>
            </div>
        );
    }
    
    const lesson = courseData.lessons.find(l => l.id === selectedLessonId);
    if (!lesson) {
        return (
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
                <p>Lesson not found</p>
            </div>
        );
    }
    
    const module = courseData.modules ? courseData.modules.find(m => m.id === lesson.module_id) : null;
    const course = module && courseData.courses ? courseData.courses.find(c => c.id === module.course_id) : null;
    const exercises = courseData.code_exercises ? courseData.code_exercises.filter(e => e.lesson_id === lesson.id) : [];
    const allLessonsInModule = courseData.lessons && module ? courseData.lessons.filter(l => l.module_id === module.id).sort((a,b) => a.order_index - b.order_index) : [];
    const currentIndex = allLessonsInModule.findIndex(l => l.id === lesson.id);

    const goToCourseView = () => {
        if (course) {
            setSelectedCourseId(course.id);
        }
        setView('course');
    };
    
    const goToLesson = (lessonId) => {
        setSelectedLessonId(lessonId);
    };

    return (
        <div>
            <div className="mb-6 text-sm text-gray-400">
                <span className="cursor-pointer hover:underline" onClick={goToCourseView}>{course.title}</span>
                <span className="mx-2">/</span>
                <span>{module.title}</span>
            </div>
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8">
                <h2 className="text-4xl font-extrabold mb-2 text-white">{lesson.title}</h2>
                <p className="text-gray-400 mb-6">{lesson.description}</p>
                <div className="border-t border-gray-700 pt-6">
                    <MarkdownRenderer content={lesson.content} />
                </div>
                {exercises.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-2xl font-bold mb-4 text-blue-300">Code Exercises</h3>
                        {exercises.map(ex => <CodeExercise key={ex.id} exercise={ex} />)}
                    </div>
                )}
            </div>
            <div className="flex justify-between mt-8">
                {currentIndex > 0 ? (
                    <button onClick={() => goToLesson(allLessonsInModule[currentIndex - 1].id)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Previous Lesson
                    </button>
                ) : <div></div>}
                {currentIndex < allLessonsInModule.length - 1 ? (
                    <button onClick={() => goToLesson(allLessonsInModule[currentIndex + 1].id)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Next Lesson
                    </button>
                ) : <div></div>}
            </div>
        </div>
    );
};

export default LessonView;