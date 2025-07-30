import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const XorProblemVisualizer = () => {
    const d3Container = useRef(null);
    const [transformed, setTransformed] = useState(false);

    const xorData = [
        { x: 0, y: 0, class: 0 },
        { x: 0, y: 1, class: 1 },
        { x: 1, y: 0, class: 1 },
        { x: 1, y: 1, class: 0 },
    ];
    
    // Simple non-linear transformation
    const transform = d => ({ x: d.x + d.y, y: d.x * d.y, class: d.class });

    useEffect(() => {
        if (d3Container.current) {
            const svg = d3.select(d3Container.current);
            svg.selectAll("*").remove();

            const margin = { top: 20, right: 20, bottom: 30, left: 40 };
            const width = 400 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            const chart = svg
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const data = transformed ? xorData.map(transform) : xorData;
            const xDomain = d3.extent(data, d => d.x);
            const yDomain = d3.extent(data, d => d.y);
            
            const x = d3.scaleLinear().domain([xDomain[0] - 0.5, xDomain[1] + 0.5]).range([0, width]);
            const y = d3.scaleLinear().domain([yDomain[0] - 0.5, yDomain[1] + 0.5]).range([height, 0]);

            chart.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x)).attr("color", "#9ca3af");
            chart.append("g").call(d3.axisLeft(y)).attr("color", "#9ca3af");
            
            const color = d3.scaleOrdinal().domain([0, 1]).range(["#f97316", "#3b82f6"]);

            const circles = chart.selectAll("circle").data(data, d => `${d.x}-${d.y}`);
            
            circles.enter()
                .append("circle")
                .attr("cx", d => x(d.x))
                .attr("cy", d => y(d.y))
                .attr("r", 0)
                .attr("fill", d => color(d.class))
                .transition()
                .duration(500)
                .attr("r", 10);

            circles.transition()
                .duration(1000)
                .attr("cx", d => x(d.x))
                .attr("cy", d => y(d.y));

            // Add separating line if transformed
            if (transformed) {
                chart.append("line")
                    .attr("x1", x(0.5))
                    .attr("y1", y(yDomain[0] - 0.5))
                    .attr("x2", x(0.5))
                    .attr("y2", y(yDomain[1] + 0.5))
                    .attr("stroke", "white")
                    .attr("stroke-width", 2)
                    .style("stroke-dasharray", ("3, 3"));
            }
        }
    }, [transformed]);

    return (
        <div className="bg-gray-900 p-6 rounded-lg my-6 text-center">
            <h3 className="text-xl font-bold text-white mb-4">Interactive XOR Problem</h3>
            <svg ref={d3Container} />
            <div className="mt-4">
                <button onClick={() => setTransformed(!transformed)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
                    {transformed ? 'Reset to Original Problem' : 'Show Hidden Layer Transformation'}
                </button>
            </div>
        </div>
    );
};

export default XorProblemVisualizer;