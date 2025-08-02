#!/usr/bin/env python3
"""
rUv-Swarm Course System Monitor
Real-time system health monitoring with visual dashboards
"""

import asyncio
import json
import time
import threading
import logging
import sqlite3
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from collections import defaultdict, deque
import subprocess
import socket
import random
import psutil
import requests
from flask import Flask, render_template_string, jsonify, send_from_directory
from flask_socketio import SocketIO, emit
import plotly.graph_objs as go
import plotly.utils

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('system_monitor.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class SystemMetrics:
    """System performance metrics"""
    timestamp: float
    cpu_percent: float
    memory_percent: float
    disk_usage: float
    network_sent: int
    network_recv: int
    active_connections: int
    load_average: float

@dataclass
class DatabaseMetrics:
    """Database performance metrics"""
    timestamp: float
    query_count: int
    avg_query_time: float
    active_connections: int
    cache_hit_ratio: float
    slow_queries: int
    db_size_mb: float

@dataclass
class CodeExecutionMetrics:
    """Code execution performance tracking"""
    timestamp: float
    execution_id: str
    language: str
    execution_time_ms: float
    memory_usage_mb: float
    success: bool
    error_message: Optional[str] = None

@dataclass
class UserActivityMetrics:
    """User activity monitoring"""
    timestamp: float
    user_id: str
    session_id: str
    action: str  # 'login', 'logout', 'code_execute', 'lesson_complete', etc.
    page: str
    duration_seconds: Optional[float] = None

@dataclass
class SecurityEvent:
    """Security event logging"""
    timestamp: float
    event_type: str  # 'failed_login', 'suspicious_activity', 'rate_limit', etc.
    severity: str  # 'low', 'medium', 'high', 'critical'
    user_id: Optional[str]
    ip_address: str
    details: Dict[str, Any]

class SystemMonitor:
    """Main system monitoring class"""
    
    def __init__(self):
        self.app = Flask(__name__)
        self.socketio = SocketIO(self.app, cors_allowed_origins="*")
        
        # Data storage
        self.system_metrics: deque = deque(maxlen=1000)
        self.db_metrics: deque = deque(maxlen=1000)
        self.code_metrics: deque = deque(maxlen=1000)
        self.user_activities: deque = deque(maxlen=1000)
        self.security_events: deque = deque(maxlen=1000)
        
        # Real-time counters
        self.active_users = set()
        self.total_executions = 0
        self.successful_executions = 0
        self.course_completions = defaultdict(int)
        
        # Alert thresholds
        self.alert_thresholds = {
            'cpu_percent': 80.0,
            'memory_percent': 85.0,
            'disk_usage': 90.0,
            'response_time_ms': 1000.0,
            'failed_logins_per_minute': 5,
            'error_rate_percent': 10.0
        }
        
        # Initialize database
        self.init_database()
        
        # Setup Flask routes
        self.setup_routes()
        
        # Start monitoring threads
        self.start_monitoring()
    
    def init_database(self):
        """Initialize SQLite database for persistent storage"""
        self.conn = sqlite3.connect('monitoring.db', check_same_thread=False)
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS system_metrics (
                timestamp REAL,
                cpu_percent REAL,
                memory_percent REAL,
                disk_usage REAL,
                network_sent INTEGER,
                network_recv INTEGER,
                active_connections INTEGER,
                load_average REAL
            )
        ''')
        
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS code_executions (
                timestamp REAL,
                execution_id TEXT,
                language TEXT,
                execution_time_ms REAL,
                memory_usage_mb REAL,
                success BOOLEAN,
                error_message TEXT
            )
        ''')
        
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS user_activities (
                timestamp REAL,
                user_id TEXT,
                session_id TEXT,
                action TEXT,
                page TEXT,
                duration_seconds REAL
            )
        ''')
        
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS security_events (
                timestamp REAL,
                event_type TEXT,
                severity TEXT,
                user_id TEXT,
                ip_address TEXT,
                details TEXT
            )
        ''')
        
        self.conn.commit()
        logger.info("Database initialized successfully")
    
    def collect_system_metrics(self) -> SystemMetrics:
        """Collect current system metrics"""
        try:
            # CPU and Memory
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            
            # Disk usage
            disk = psutil.disk_usage('/')
            disk_usage = (disk.used / disk.total) * 100
            
            # Network stats
            net_io = psutil.net_io_counters()
            network_sent = net_io.bytes_sent
            network_recv = net_io.bytes_recv
            
            # Network connections
            connections = len(psutil.net_connections())
            
            # Load average (Unix-like systems)
            try:
                load_avg = psutil.getloadavg()[0]
            except:
                load_avg = 0.0
            
            metrics = SystemMetrics(
                timestamp=time.time(),
                cpu_percent=cpu_percent,
                memory_percent=memory.percent,
                disk_usage=disk_usage,
                network_sent=network_sent,
                network_recv=network_recv,
                active_connections=connections,
                load_average=load_avg
            )
            
            # Store in database
            self.conn.execute('''
                INSERT INTO system_metrics VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                metrics.timestamp, metrics.cpu_percent, metrics.memory_percent,
                metrics.disk_usage, metrics.network_sent, metrics.network_recv,
                metrics.active_connections, metrics.load_average
            ))
            self.conn.commit()
            
            return metrics
            
        except Exception as e:
            logger.error(f"Error collecting system metrics: {e}")
            return None
    
    def simulate_database_metrics(self) -> DatabaseMetrics:
        """Simulate database performance metrics"""
        # In a real implementation, these would come from actual database monitoring
        base_query_time = 50 + random.uniform(-20, 30)
        if random.random() < 0.05:  # 5% chance of slow query
            base_query_time += random.uniform(500, 2000)
        
        metrics = DatabaseMetrics(
            timestamp=time.time(),
            query_count=random.randint(10, 100),
            avg_query_time=base_query_time,
            active_connections=random.randint(5, 50),
            cache_hit_ratio=random.uniform(0.85, 0.98),
            slow_queries=random.randint(0, 3),
            db_size_mb=random.uniform(100, 500)
        )
        
        return metrics
    
    def log_code_execution(self, execution_id: str, language: str, 
                          execution_time_ms: float, memory_usage_mb: float,
                          success: bool, error_message: str = None):
        """Log code execution metrics"""
        metrics = CodeExecutionMetrics(
            timestamp=time.time(),
            execution_id=execution_id,
            language=language,
            execution_time_ms=execution_time_ms,
            memory_usage_mb=memory_usage_mb,
            success=success,
            error_message=error_message
        )
        
        self.code_metrics.append(metrics)
        self.total_executions += 1
        if success:
            self.successful_executions += 1
        
        # Store in database
        self.conn.execute('''
            INSERT INTO code_executions VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            metrics.timestamp, metrics.execution_id, metrics.language,
            metrics.execution_time_ms, metrics.memory_usage_mb,
            metrics.success, metrics.error_message
        ))
        self.conn.commit()
        
        # Emit real-time update
        self.socketio.emit('code_execution', asdict(metrics))
        
        # Check for alerts
        if execution_time_ms > self.alert_thresholds['response_time_ms']:
            self.trigger_alert('slow_execution', {
                'execution_id': execution_id,
                'execution_time': execution_time_ms,
                'language': language
            })
    
    def log_user_activity(self, user_id: str, session_id: str, action: str, 
                         page: str, duration_seconds: float = None):
        """Log user activity"""
        activity = UserActivityMetrics(
            timestamp=time.time(),
            user_id=user_id,
            session_id=session_id,
            action=action,
            page=page,
            duration_seconds=duration_seconds
        )
        
        self.user_activities.append(activity)
        self.active_users.add(user_id)
        
        # Track course completions
        if action == 'lesson_complete':
            self.course_completions[page] += 1
        
        # Store in database
        self.conn.execute('''
            INSERT INTO user_activities VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            activity.timestamp, activity.user_id, activity.session_id,
            activity.action, activity.page, activity.duration_seconds
        ))
        self.conn.commit()
        
        # Emit real-time update
        self.socketio.emit('user_activity', asdict(activity))
    
    def log_security_event(self, event_type: str, severity: str, 
                          user_id: str, ip_address: str, details: Dict):
        """Log security events"""
        event = SecurityEvent(
            timestamp=time.time(),
            event_type=event_type,
            severity=severity,
            user_id=user_id,
            ip_address=ip_address,
            details=details
        )
        
        self.security_events.append(event)
        
        # Store in database
        self.conn.execute('''
            INSERT INTO security_events VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            event.timestamp, event.event_type, event.severity,
            event.user_id, event.ip_address, json.dumps(event.details)
        ))
        self.conn.commit()
        
        # Emit real-time alert
        self.socketio.emit('security_event', asdict(event))
        
        if severity in ['high', 'critical']:
            self.trigger_alert('security', asdict(event))
    
    def trigger_alert(self, alert_type: str, data: Dict):
        """Trigger system alert"""
        alert = {
            'timestamp': time.time(),
            'type': alert_type,
            'data': data,
            'acknowledged': False
        }
        
        logger.warning(f"ALERT: {alert_type} - {data}")
        self.socketio.emit('alert', alert)
    
    def get_performance_summary(self) -> Dict:
        """Get overall performance summary"""
        now = time.time()
        hour_ago = now - 3600
        
        # Recent system metrics
        recent_system = [m for m in self.system_metrics if m.timestamp > hour_ago]
        avg_cpu = sum(m.cpu_percent for m in recent_system) / len(recent_system) if recent_system else 0
        avg_memory = sum(m.memory_percent for m in recent_system) / len(recent_system) if recent_system else 0
        
        # Code execution stats
        recent_executions = [m for m in self.code_metrics if m.timestamp > hour_ago]
        success_rate = (sum(1 for m in recent_executions if m.success) / len(recent_executions) * 100) if recent_executions else 0
        avg_exec_time = sum(m.execution_time_ms for m in recent_executions) / len(recent_executions) if recent_executions else 0
        
        # User activity
        recent_activities = [a for a in self.user_activities if a.timestamp > hour_ago]
        unique_users = len(set(a.user_id for a in recent_activities))
        
        return {
            'system': {
                'avg_cpu_percent': round(avg_cpu, 2),
                'avg_memory_percent': round(avg_memory, 2),
                'active_users': unique_users,
                'uptime_hours': round((now - self.start_time) / 3600, 2)
            },
            'performance': {
                'total_executions': self.total_executions,
                'success_rate_percent': round(success_rate, 2),
                'avg_execution_time_ms': round(avg_exec_time, 2),
                'executions_last_hour': len(recent_executions)
            },
            'courses': {
                'total_completions': sum(self.course_completions.values()),
                'popular_lessons': dict(sorted(self.course_completions.items(), key=lambda x: x[1], reverse=True)[:5])
            }
        }
    
    def setup_routes(self):
        """Setup Flask routes for web dashboard"""
        
        @self.app.route('/')
        def dashboard():
            return render_template_string(DASHBOARD_HTML)
        
        @self.app.route('/api/metrics')
        def get_metrics():
            return jsonify({
                'system': [asdict(m) for m in list(self.system_metrics)[-50:]],
                'database': [asdict(m) for m in list(self.db_metrics)[-50:]],
                'code_executions': [asdict(m) for m in list(self.code_metrics)[-50:]],
                'user_activities': [asdict(m) for m in list(self.user_activities)[-50:]],
                'security_events': [asdict(m) for m in list(self.security_events)[-20:]]
            })
        
        @self.app.route('/api/performance')
        def get_performance():
            return jsonify(self.get_performance_summary())
        
        @self.app.route('/api/charts/system')
        def system_chart():
            recent_metrics = list(self.system_metrics)[-100:]
            
            timestamps = [datetime.fromtimestamp(m.timestamp) for m in recent_metrics]
            cpu_data = [m.cpu_percent for m in recent_metrics]
            memory_data = [m.memory_percent for m in recent_metrics]
            
            fig = go.Figure()
            fig.add_trace(go.Scatter(x=timestamps, y=cpu_data, name='CPU %', line=dict(color='red')))
            fig.add_trace(go.Scatter(x=timestamps, y=memory_data, name='Memory %', line=dict(color='blue')))
            
            fig.update_layout(
                title='System Performance',
                xaxis_title='Time',
                yaxis_title='Percentage',
                hovermode='x unified'
            )
            
            return jsonify(json.loads(plotly.utils.PlotlyJSONEncoder().encode(fig)))
        
        @self.socketio.on('connect')
        def handle_connect():
            emit('connected', {'data': 'Connected to monitoring system'})
        
        @self.socketio.on('get_status')
        def handle_get_status():
            emit('status', self.get_performance_summary())
    
    def start_monitoring(self):
        """Start monitoring threads"""
        self.start_time = time.time()
        
        def system_monitor_loop():
            while True:
                try:
                    metrics = self.collect_system_metrics()
                    if metrics:
                        self.system_metrics.append(metrics)
                        self.socketio.emit('system_metrics', asdict(metrics))
                        
                        # Check for alerts
                        if metrics.cpu_percent > self.alert_thresholds['cpu_percent']:
                            self.trigger_alert('high_cpu', {'cpu_percent': metrics.cpu_percent})
                        
                        if metrics.memory_percent > self.alert_thresholds['memory_percent']:
                            self.trigger_alert('high_memory', {'memory_percent': metrics.memory_percent})
                    
                    time.sleep(5)  # Collect every 5 seconds
                except Exception as e:
                    logger.error(f"System monitor error: {e}")
                    time.sleep(10)
        
        def db_monitor_loop():
            while True:
                try:
                    metrics = self.simulate_database_metrics()
                    self.db_metrics.append(metrics)
                    self.socketio.emit('db_metrics', asdict(metrics))
                    time.sleep(10)  # Every 10 seconds
                except Exception as e:
                    logger.error(f"DB monitor error: {e}")
                    time.sleep(15)
        
        # Start monitoring threads
        threading.Thread(target=system_monitor_loop, daemon=True).start()
        threading.Thread(target=db_monitor_loop, daemon=True).start()
        
        logger.info("Monitoring threads started")
    
    def simulate_user_activity(self):
        """Simulate user activities for demo purposes"""
        users = ['user1', 'user2', 'user3', 'user4', 'user5']
        pages = ['dashboard', 'lesson1', 'lesson2', 'lesson3', 'editor', 'quiz']
        actions = ['login', 'logout', 'code_execute', 'lesson_complete', 'quiz_submit']
        
        def activity_loop():
            while True:
                try:
                    user = random.choice(users)
                    page = random.choice(pages)
                    action = random.choice(actions)
                    session_id = f"session_{random.randint(1000, 9999)}"
                    
                    self.log_user_activity(user, session_id, action, page, random.uniform(30, 300))
                    
                    # Simulate code execution
                    if action == 'code_execute':
                        exec_id = f"exec_{random.randint(10000, 99999)}"
                        language = random.choice(['python', 'javascript', 'java', 'cpp'])
                        exec_time = random.uniform(100, 2000)
                        memory_usage = random.uniform(10, 100)
                        success = random.random() > 0.1  # 90% success rate
                        
                        self.log_code_execution(exec_id, language, exec_time, memory_usage, success)
                    
                    # Simulate security events occasionally
                    if random.random() < 0.05:  # 5% chance
                        self.log_security_event(
                            'failed_login', 'medium', user, 
                            f"192.168.1.{random.randint(1, 255)}", 
                            {'attempts': random.randint(1, 5)}
                        )
                    
                    time.sleep(random.uniform(5, 15))
                except Exception as e:
                    logger.error(f"Activity simulation error: {e}")
                    time.sleep(10)
        
        threading.Thread(target=activity_loop, daemon=True).start()
    
    def run(self, host='0.0.0.0', port=5000, debug=False):
        """Run the monitoring system"""
        logger.info(f"Starting system monitor on {host}:{port}")
        
        # Start activity simulation
        self.simulate_user_activity()
        
        self.socketio.run(self.app, host=host, port=port, debug=debug)

# HTML Dashboard Template
DASHBOARD_HTML = '''
<!DOCTYPE html>
<html>
<head>
    <title>rUv-Swarm Course System Monitor</title>
    <script src="https://cdn.socket.io/4.5.0/socket.io.min.js"></script>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #1a1a1a; color: white; }
        .header { text-align: center; margin-bottom: 30px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .metric-card { background: #2d2d2d; padding: 20px; border-radius: 10px; border: 1px solid #444; }
        .metric-value { font-size: 2em; font-weight: bold; color: #00ff88; }
        .metric-label { color: #888; margin-bottom: 10px; }
        .chart-container { height: 400px; margin: 20px 0; }
        .alert { background: #ff4444; padding: 10px; margin: 10px 0; border-radius: 5px; }
        .status-indicator { display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 8px; }
        .status-good { background: #00ff88; }
        .status-warning { background: #ffaa00; }
        .status-critical { background: #ff4444; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🐝 rUv-Swarm Course System Monitor</h1>
        <p>Real-time Performance & Health Dashboard</p>
    </div>
    
    <div class="metrics-grid">
        <div class="metric-card">
            <div class="metric-label">System Status</div>
            <div class="metric-value" id="system-status">
                <span class="status-indicator status-good"></span>Online
            </div>
        </div>
        
        <div class="metric-card">
            <div class="metric-label">CPU Usage</div>
            <div class="metric-value" id="cpu-usage">0%</div>
        </div>
        
        <div class="metric-card">
            <div class="metric-label">Memory Usage</div>
            <div class="metric-value" id="memory-usage">0%</div>
        </div>
        
        <div class="metric-card">
            <div class="metric-label">Active Users</div>
            <div class="metric-value" id="active-users">0</div>
        </div>
        
        <div class="metric-card">
            <div class="metric-label">Code Executions</div>
            <div class="metric-value" id="code-executions">0</div>
        </div>
        
        <div class="metric-card">
            <div class="metric-label">Success Rate</div>
            <div class="metric-value" id="success-rate">0%</div>
        </div>
    </div>
    
    <div class="chart-container">
        <div id="system-chart"></div>
    </div>
    
    <div class="chart-container">
        <div id="execution-chart"></div>
    </div>
    
    <div id="alerts-container"></div>
    
    <script>
        const socket = io();
        
        // Charts
        let systemChart, executionChart;
        
        // Initialize charts
        function initCharts() {
            systemChart = {
                data: [{
                    x: [],
                    y: [],
                    name: 'CPU %',
                    type: 'scatter',
                    line: {color: 'red'}
                }, {
                    x: [],
                    y: [],
                    name: 'Memory %',
                    type: 'scatter',
                    line: {color: 'blue'}
                }],
                layout: {
                    title: 'System Performance',
                    xaxis: {title: 'Time'},
                    yaxis: {title: 'Percentage'},
                    paper_bgcolor: '#2d2d2d',
                    plot_bgcolor: '#2d2d2d',
                    font: {color: 'white'}
                }
            };
            
            Plotly.newPlot('system-chart', systemChart.data, systemChart.layout);
            
            executionChart = {
                data: [{
                    x: [],
                    y: [],
                    name: 'Execution Time (ms)',
                    type: 'scatter',
                    line: {color: 'green'}
                }],
                layout: {
                    title: 'Code Execution Performance',
                    xaxis: {title: 'Time'},
                    yaxis: {title: 'Milliseconds'},
                    paper_bgcolor: '#2d2d2d',
                    plot_bgcolor: '#2d2d2d',
                    font: {color: 'white'}
                }
            };
            
            Plotly.newPlot('execution-chart', executionChart.data, executionChart.layout);
        }
        
        // Update metrics
        function updateMetrics(data) {
            document.getElementById('cpu-usage').textContent = data.cpu_percent.toFixed(1) + '%';
            document.getElementById('memory-usage').textContent = data.memory_percent.toFixed(1) + '%';
            
            // Update system chart
            const now = new Date();
            systemChart.data[0].x.push(now);
            systemChart.data[0].y.push(data.cpu_percent);
            systemChart.data[1].x.push(now);
            systemChart.data[1].y.push(data.memory_percent);
            
            // Keep only last 50 points
            if (systemChart.data[0].x.length > 50) {
                systemChart.data[0].x.shift();
                systemChart.data[0].y.shift();
                systemChart.data[1].x.shift();
                systemChart.data[1].y.shift();
            }
            
            Plotly.redraw('system-chart');
        }
        
        function updateExecutionMetrics(data) {
            const now = new Date();
            executionChart.data[0].x.push(now);
            executionChart.data[0].y.push(data.execution_time_ms);
            
            if (executionChart.data[0].x.length > 50) {
                executionChart.data[0].x.shift();
                executionChart.data[0].y.shift();
            }
            
            Plotly.redraw('execution-chart');
        }
        
        function showAlert(alert) {
            const alertsContainer = document.getElementById('alerts-container');
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert';
            alertDiv.innerHTML = `<strong>ALERT:</strong> ${alert.type} - ${JSON.stringify(alert.data)}`;
            alertsContainer.appendChild(alertDiv);
            
            // Remove alert after 10 seconds
            setTimeout(() => {
                alertDiv.remove();
            }, 10000);
        }
        
        // Socket event handlers
        socket.on('connected', (data) => {
            console.log('Connected to monitoring system');
            socket.emit('get_status');
        });
        
        socket.on('system_metrics', updateMetrics);
        socket.on('code_execution', updateExecutionMetrics);
        socket.on('alert', showAlert);
        
        socket.on('status', (data) => {
            document.getElementById('active-users').textContent = data.system.active_users;
            document.getElementById('code-executions').textContent = data.performance.total_executions;
            document.getElementById('success-rate').textContent = data.performance.success_rate_percent.toFixed(1) + '%';
        });
        
        // Initialize
        initCharts();
        
        // Refresh status every 30 seconds
        setInterval(() => {
            socket.emit('get_status');
        }, 30000);
    </script>
</body>
</html>
'''

if __name__ == '__main__':
    # Install required packages if not available
    try:
        import psutil
        import flask
        import flask_socketio
        import plotly
    except ImportError as e:
        print(f"Missing required package: {e}")
        print("Install with: pip install psutil flask flask-socketio plotly requests")
        exit(1)
    
    monitor = SystemMonitor()
    monitor.run(debug=True)