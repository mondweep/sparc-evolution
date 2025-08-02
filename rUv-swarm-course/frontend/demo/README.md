# 🐝 rUv-Swarm Course System Monitoring Demo

A comprehensive system monitoring demonstration showcasing real-time performance tracking, user activity monitoring, code execution analytics, and intelligent alerting for the rUv-Swarm Course platform.

## 🚀 Features

### Real-time System Monitoring
- **CPU & Memory Usage**: Live tracking with historical graphs
- **Disk & Network I/O**: Storage and bandwidth utilization
- **System Health**: Uptime, load average, and connection monitoring
- **Performance Metrics**: Response times and throughput analysis

### Code Execution Tracking
- **Multi-language Support**: Python, JavaScript, Java, C++ execution monitoring
- **Performance Analysis**: Execution time, memory usage, success rates
- **User Analytics**: Code execution patterns and learning progress
- **Error Tracking**: Failed executions and error pattern analysis

### User Activity Monitoring
- **Session Tracking**: User login/logout, session duration
- **Learning Progress**: Lesson completion, quiz submissions
- **Engagement Metrics**: Active users, popular lessons, retention rates
- **Real-time Feed**: Live user activity updates

### Intelligent Alert System
- **Threshold Monitoring**: CPU, memory, disk, response time alerts
- **Multi-channel Notifications**: Email, Slack, SMS, webhooks
- **Alert Management**: Acknowledgment, resolution, escalation
- **Smart Cooldowns**: Prevents alert spam with configurable periods

### Performance Testing
- **Load Testing**: Concurrent user simulation
- **Stress Testing**: System capacity analysis
- **Benchmark Testing**: Code execution performance
- **WebSocket Testing**: Real-time connection performance

### Visual Dashboards
- **Interactive Charts**: Real-time graphs with Plotly
- **Multi-tab Interface**: Overview, Performance, Users, Security
- **Responsive Design**: Mobile-friendly monitoring
- **Dark Theme**: Professional monitoring appearance

## 📦 Installation

### Prerequisites
- Python 3.8 or higher
- Node.js (for frontend components)
- Modern web browser

### Quick Start
```bash
# Clone or navigate to the demo directory
cd /workspaces/sparc-evolution/rUv-swarm-course/frontend/demo

# Install Python dependencies
pip install -r requirements.txt

# Run the complete demo
python run_demo.py
```

### Manual Installation
```bash
# Install core dependencies
pip install psutil flask flask-socketio plotly requests websocket-client

# Install optional monitoring enhancements
pip install pandas numpy pyyaml colorlog

# For testing
pip install pytest pytest-cov
```

## 🎯 Usage

### Complete Demo
Run the full monitoring demonstration:
```bash
python run_demo.py --duration 300
```

**Options:**
- `--duration 300`: Demo duration in seconds (default: 5 minutes)
- `--port 5000`: Monitor server port (default: 5000)
- `--no-browser`: Don't auto-open browser
- `--no-load`: Skip user load simulation
- `--no-alerts`: Skip alert simulation

### Individual Components

#### System Monitor
```bash
python system_monitor.py
# Access at: http://localhost:5000
```

#### Performance Testing
```bash
python performance_test.py --url http://localhost:3000
```

#### Alert System
```bash
python alert_system.py
```

### Custom Configuration
Edit the configuration in `run_demo.py`:
```python
self.config = {
    'monitor_port': 5000,
    'demo_duration': 300,
    'auto_open_browser': True,
    'simulate_load': True,
    'simulate_alerts': True
}
```

## 📊 Dashboard Access

Once running, access the monitoring interfaces:

- **Main Monitor**: http://localhost:5000
- **Interactive Dashboard**: http://localhost:5000/monitoring_dashboard.html
- **API Endpoints**: http://localhost:5000/api/metrics

### Dashboard Tabs
1. **Overview**: System performance and execution metrics
2. **Performance**: Database, network, and response time analytics
3. **Users**: User engagement and activity feeds
4. **Security**: Security events and failed login tracking

## 🔧 Component Details

### System Monitor (`system_monitor.py`)
- Real-time system metrics collection
- SQLite database for persistent storage
- WebSocket real-time updates
- RESTful API endpoints
- Configurable alert thresholds

### Performance Tester (`performance_test.py`)
- Load testing with concurrent users
- Code execution benchmarking
- WebSocket performance testing
- Comprehensive report generation
- Resource usage monitoring

### Alert System (`alert_system.py`)
- Rule-based alert conditions
- Multi-channel notifications
- Alert state management
- Cooldown and threshold logic
- Alert acknowledgment/resolution

### Demo Orchestrator (`run_demo.py`)
- Coordinates all components
- Simulates realistic user load
- Generates comprehensive reports
- Browser automation
- Cleanup management

## 📈 Metrics Collected

### System Metrics
- CPU usage percentage
- Memory utilization
- Disk space usage
- Network I/O (sent/received)
- Active connections
- Load average

### Code Execution Metrics
- Execution time (milliseconds)
- Memory usage (MB)
- Success/failure rates
- Language-specific performance
- Error messages and patterns

### User Activity Metrics
- Login/logout events
- Session durations
- Lesson completions
- Code execution attempts
- Page views and navigation

### Security Metrics
- Failed login attempts
- Suspicious activity detection
- Rate limiting events
- IP-based tracking

## 🚨 Alert Rules

### Default Alert Configurations
- **High CPU**: > 80% for 60 seconds
- **Critical CPU**: > 95% for 30 seconds
- **High Memory**: > 85% for 120 seconds
- **Low Disk Space**: > 90% usage
- **Slow Execution**: > 2000ms average
- **High Error Rate**: > 10% failures
- **Failed Login Spike**: > 5 attempts/minute

### Notification Channels
- **Email**: SMTP with HTML formatting
- **Slack**: Webhook with rich attachments
- **SMS**: Twilio integration (configurable)
- **Webhook**: Custom endpoint notifications

## 📁 Output Files

The demo generates several output files in the `results/` directory:

- `performance_report_<timestamp>.json`: Performance test results
- `demo_report_<timestamp>.json`: Complete demo summary
- `monitoring.db`: SQLite database with metrics
- `alerts.db`: Alert history and rules
- `system_monitor.log`: System monitoring logs

## 🎨 Customization

### Adding Custom Metrics
```python
# In system_monitor.py
def collect_custom_metrics(self):
    return {
        'custom_metric': your_metric_value,
        'another_metric': another_value
    }
```

### Custom Alert Rules
```python
# In alert_system.py
custom_rule = AlertRule(
    name="custom_alert",
    condition="custom_metric > threshold",
    severity="medium",
    threshold_duration=60,
    cooldown_period=300,
    notification_channels=["email"]
)
alert_engine.add_alert_rule(custom_rule)
```

### Dashboard Customization
Edit `monitoring_dashboard.html` to:
- Add new chart types
- Modify color schemes
- Add custom metrics displays
- Integrate additional APIs

## 🔍 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
python run_demo.py --port 5001
```

**Missing Dependencies**
```bash
pip install -r requirements.txt
```

**Browser Not Opening**
```bash
python run_demo.py --no-browser
# Then manually open: http://localhost:5000
```

**Permission Errors (Linux/Mac)**
```bash
sudo python run_demo.py
```

### Debug Mode
Enable detailed logging:
```python
logging.basicConfig(level=logging.DEBUG)
```

## 📚 Architecture

### System Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Web Browser   │◄──►│  Flask Server    │◄──►│ System Monitor  │
│   (Dashboard)   │    │  (WebSocket/API) │    │  (Metrics)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Alert Engine    │◄──►│   Notifications │
                       │  (Rules/Logic)   │    │ (Email/Slack)   │
                       └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │ SQLite Database  │
                       │ (Persistence)    │
                       └──────────────────┘
```

### Data Flow
1. **Metrics Collection**: System stats gathered every 5 seconds
2. **Real-time Updates**: WebSocket pushes to dashboard
3. **Alert Evaluation**: Rules checked against metrics
4. **Notification Dispatch**: Multi-channel alert delivery
5. **Data Persistence**: SQLite storage for history
6. **API Access**: RESTful endpoints for external integration

## 🎯 Use Cases

### Development Teams
- Monitor application performance during development
- Track code execution efficiency
- Identify performance bottlenecks
- Set up automated alerting

### Educational Platforms
- Monitor student engagement and progress
- Track code execution patterns
- Analyze learning effectiveness
- Ensure system reliability

### DevOps Teams
- System health monitoring
- Performance trend analysis
- Alert management
- Capacity planning

### QA Testing
- Load testing automation
- Performance regression detection
- System stress validation
- Benchmark comparisons

## 🤝 Contributing

### Adding New Features
1. Fork the repository
2. Create feature branch
3. Add tests for new functionality
4. Update documentation
5. Submit pull request

### Reporting Issues
- Use GitHub issues
- Include system information
- Provide reproduction steps
- Attach relevant logs

## 📄 License

This monitoring demo is part of the rUv-Swarm Course project and follows the project's licensing terms.

## 🙏 Acknowledgments

- **Plotly**: Interactive charting library
- **Flask-SocketIO**: Real-time web communication
- **psutil**: System metrics collection
- **SQLite**: Lightweight database storage

---

**Happy Monitoring! 🐝**

For questions or support, please refer to the main rUv-Swarm Course documentation or create an issue in the project repository.