import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ActivationFunctionVisualizer = () => {
    const d3Container = useRef(null);
    const [inputValue, setInputValue] = useState(1);

    const functions = {
        Sigmoid: (x) => 1 / (1 + Math.exp(-x)),
        Tanh: (x) => Math.tanh(x),
        ReLU: (x) => Math.max(0, x),
        'Leaky ReLU': (x) => Math.max(0.01 * x, x),
    };

    useEffect(() => {
        if (d3Container.current) {
            const svg = d3.select(d3Container.current);
            svg.selectAll("*").remove(); // Clear previous renders

            const margin = { top: 40, right: 30, bottom: 50, left: 50 };
            const width = 500 - margin.left - margin.right;
            const height = 350 - margin.top - margin.bottom;

            const chart = svg
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const x = d3.scaleLinear().domain([-5, 5]).range([0, width]);
            const y = d3.scaleLinear().domain([-1.5, 1.5]).range([height, 0]);

            chart.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x)).attr("color", "#9ca3af");
            chart.append("g").call(d3.axisLeft(y)).attr("color", "#9ca3af");

            // Add grid lines
            chart.append("g").attr("class", "grid").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).tickSize(-height).tickFormat("")).style("stroke", "#4b5563").style("stroke-opacity", .5);
            chart.append("g").attr("class", "grid").call(d3.axisLeft(y).tickSize(-width).tickFormat("")).style("stroke", "#4b5563").style("stroke-opacity", .5);

            const colors = d3.scaleOrdinal(d3.schemeCategory10);
            const data = d3.range(-5, 5.1, 0.1);

            Object.keys(functions).forEach((name, i) => {
                chart.append("path")
                    .datum(data)
                    .attr("fill", "none")
                    .attr("stroke", colors(i))
                    .attr("stroke-width", 2.5)
                    .attr("d", d3.line().x(d => x(d)).y(d => y(functions[name](d))));
            });

            // Input line and point
            const inputGroup = chart.append("g");
            const inputLine = inputGroup.append("line")
                .attr("stroke", "white")
                .attr("stroke-width", 1.5)
                .attr("stroke-dasharray", "4");

            const inputPoints = Object.keys(functions).map((name, i) =>
                inputGroup.append("circle")
                    .attr("r", 5)
                    .attr("fill", colors(i))
            );

            const updateInput = (val) => {
                inputLine.attr("x1", x(val)).attr("y1", y(-1.5)).attr("x2", x(val)).attr("y2", y(1.5));
                inputPoints.forEach((circle, i) => {
                    const name = Object.keys(functions)[i];
                    circle.attr("cx", x(val)).attr("cy", y(functions[name](val)));
                });
            };
            
            updateInput(inputValue);
        }
    }, [inputValue, functions]);

    return (
        <div className="bg-gray-900 p-6 rounded-lg my-6">
            <h3 className="text-xl font-bold text-white mb-4">Interactive Activation Functions</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-grow w-full">
                    <svg ref={d3Container} />
                </div>
                <div className="w-full md:w-64 bg-gray-800 p-4 rounded-lg">
                     <label htmlFor="inputValue" className="block mb-2 text-sm font-medium text-gray-300">Input X = {inputValue.toFixed(2)}</label>
                    <input
                        type="range"
                        min="-5"
                        max="5"
                        step="0.1"
                        value={inputValue}
                        onChange={(e) => setInputValue(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="mt-4 space-y-2">
                        {Object.keys(functions).map((name, i) => (
                            <div key={name} className="flex justify-between items-center text-sm">
                                <span style={{ color: d3.schemeCategory10[i] }} className="font-semibold">{name}:</span>
                                <span className="font-mono text-white bg-gray-700 px-2 py-1 rounded">{functions[name](inputValue).toFixed(4)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivationFunctionVisualizer;