import React, { useState } from 'react';

const CodeExercise = ({ exercise }) => {
    const [code, setCode] = useState(exercise.starter_code);
    const [output, setOutput] = useState('');
    const [showSolution, setShowSolution] = useState(false);

    const handleRun = () => {
        // Simulate running the code
        setOutput(exercise.solution_code.split('// Simulate training epochs with decreasing error')[1] || "Simulated execution...");
    };
    
    const handleShowSolution = () => {
        setCode(exercise.solution_code);
        setShowSolution(true);
    };

    return (
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <h4 className="text-xl font-bold mb-2 text-white">{exercise.title}</h4>
            <p className="text-gray-400 mb-4">{exercise.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h5 className="text-sm font-semibold mb-2 text-gray-300">Your Code</h5>
                    <textarea 
                        value={code} 
                        onChange={(e) => setCode(e.target.value)} 
                        className="w-full h-64 bg-black text-white p-4 rounded-md font-mono text-sm border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <h5 className="text-sm font-semibold mb-2 text-gray-300">Output</h5>
                    <pre className="w-full h-64 bg-black text-white p-4 rounded-md font-mono text-sm border border-gray-700 overflow-auto">
                        {output}
                    </pre>
                </div>
            </div>
            <div className="mt-4 flex space-x-4">
                <button 
                    onClick={handleRun} 
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Run Code
                </button>
                <button 
                    onClick={handleShowSolution} 
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                >
                    Show Solution
                </button>
            </div>
        </div>
    );
};

export default CodeExercise;