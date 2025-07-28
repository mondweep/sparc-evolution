#!/usr/bin/env python3
"""
rUv-Swarm Course Alert System
Smart monitoring alerts, notifications, and incident management
"""

import time
import json
import logging
import smtplib
import sqlite3
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Callable
from dataclasses import dataclass, asdict
try:
    from email.mime.text import MimeText
    from email.mime.multipart import MimeMultipart
except ImportError:
    # Fallback for systems with email module issues
    class MimeText:
        def __init__(self, *args, **kwargs):
            self.content = args[0] if args else ""
    class MimeMultipart:
        def __init__(self, *args, **kwargs):
            self._parts = []
        def attach(self, part):
            self._parts.append(part)
        def __setitem__(self, key, value):
            pass
from collections import defaultdict, deque
import threading
import queue
import requests
import psutil

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class AlertRule:
    """Alert rule configuration"""
    name: str
    condition: str  # e.g., "cpu_percent > 80"
    severity: str  # 'low', 'medium', 'high', 'critical'
    threshold_duration: int  # seconds the condition must be true
    cooldown_period: int  # seconds to wait before re-alerting
    notification_channels: List[str]  # ['email', 'slack', 'webhook']
    enabled: bool = True
    description: str = ""

@dataclass
class Alert:
    """Active alert"""
    id: str
    rule_name: str
    severity: str
    message: str
    timestamp: float
    acknowledged: bool = False
    resolved: bool = False
    acknowledged_by: Optional[str] = None
    resolved_by: Optional[str] = None
    metadata: Dict[str, Any] = None

@dataclass
class NotificationChannel:
    """Notification channel configuration"""
    name: str
    type: str  # 'email', 'slack', 'webhook', 'sms'
    config: Dict[str, Any]
    enabled: bool = True

class AlertEngine:
    """Main alert processing engine"""
    
    def __init__(self):
        self.alert_rules: Dict[str, AlertRule] = {}
        self.active_alerts: Dict[str, Alert] = {}
        self.alert_history: deque = deque(maxlen=1000)
        self.notification_channels: Dict[str, NotificationChannel] = {}
        
        # Alert state tracking
        self.condition_states: Dict[str, Dict] = defaultdict(dict)
        self.last_alert_time: Dict[str, float] = {}
        
        # Notification queue
        self.notification_queue = queue.Queue()
        
        # Initialize database
        self.init_database()
        
        # Load default rules and channels
        self.setup_default_rules()
        self.setup_default_channels()
        
        # Start processing threads
        self.start_alert_engine()
    
    def init_database(self):
        """Initialize SQLite database for alert storage"""
        self.conn = sqlite3.connect('alerts.db', check_same_thread=False)
        
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS alert_rules (
                name TEXT PRIMARY KEY,
                condition TEXT,
                severity TEXT,
                threshold_duration INTEGER,
                cooldown_period INTEGER,
                notification_channels TEXT,
                enabled BOOLEAN,
                description TEXT,
                created_at REAL,
                updated_at REAL
            )
        ''')
        
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS alert_history (
                id TEXT PRIMARY KEY,
                rule_name TEXT,
                severity TEXT,
                message TEXT,
                timestamp REAL,
                acknowledged BOOLEAN,
                resolved BOOLEAN,
                acknowledged_by TEXT,
                resolved_by TEXT,
                metadata TEXT
            )
        ''')
        
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS notification_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                alert_id TEXT,
                channel TEXT,
                status TEXT,
                timestamp REAL,
                error_message TEXT
            )
        ''')
        
        self.conn.commit()
        logger.info("Alert database initialized")
    
    def setup_default_rules(self):
        """Setup default alert rules"""
        default_rules = [
            AlertRule(
                name="high_cpu_usage",
                condition="cpu_percent > 80",
                severity="high",
                threshold_duration=60,  # 1 minute
                cooldown_period=300,    # 5 minutes
                notification_channels=["email", "slack"],
                description="CPU usage exceeds 80% for sustained period"
            ),
            AlertRule(
                name="critical_cpu_usage",
                condition="cpu_percent > 95",
                severity="critical",
                threshold_duration=30,   # 30 seconds
                cooldown_period=180,     # 3 minutes
                notification_channels=["email", "slack", "sms"],
                description="Critical CPU usage above 95%"
            ),
            AlertRule(
                name="high_memory_usage",
                condition="memory_percent > 85",
                severity="high",
                threshold_duration=120,  # 2 minutes
                cooldown_period=300,     # 5 minutes
                notification_channels=["email", "slack"],
                description="Memory usage exceeds 85%"
            ),
            AlertRule(
                name="disk_space_low",
                condition="disk_usage > 90",
                severity="high",
                threshold_duration=0,    # Immediate
                cooldown_period=1800,    # 30 minutes
                notification_channels=["email", "slack"],
                description="Disk usage exceeds 90%"
            ),
            AlertRule(
                name="slow_code_execution",
                condition="avg_execution_time > 2000",
                severity="medium",
                threshold_duration=300,  # 5 minutes
                cooldown_period=600,     # 10 minutes
                notification_channels=["email"],
                description="Average code execution time exceeds 2 seconds"
            ),
            AlertRule(
                name="high_error_rate",
                condition="error_rate > 10",
                severity="high",
                threshold_duration=180,  # 3 minutes
                cooldown_period=300,     # 5 minutes
                notification_channels=["email", "slack"],
                description="Error rate exceeds 10%"
            ),
            AlertRule(
                name="failed_login_spike",
                condition="failed_logins_per_minute > 5",
                severity="medium",
                threshold_duration=60,   # 1 minute
                cooldown_period=600,     # 10 minutes
                notification_channels=["email", "slack"],
                description="Spike in failed login attempts detected"
            ),
            AlertRule(
                name="system_offline",
                condition="system_status == 'offline'",
                severity="critical",
                threshold_duration=0,    # Immediate
                cooldown_period=60,      # 1 minute
                notification_channels=["email", "slack", "sms"],
                description="System appears to be offline"
            )
        ]
        
        for rule in default_rules:
            self.add_alert_rule(rule)
    
    def setup_default_channels(self):
        """Setup default notification channels"""
        default_channels = [
            NotificationChannel(
                name="email",
                type="email",
                config={
                    "smtp_server": "smtp.gmail.com",
                    "smtp_port": 587,
                    "username": "alerts@ruv-swarm.com",
                    "password": "app_password_here",
                    "from_email": "alerts@ruv-swarm.com",
                    "to_emails": ["admin@ruv-swarm.com", "devops@ruv-swarm.com"]
                }
            ),
            NotificationChannel(
                name="slack",
                type="slack",
                config={
                    "webhook_url": "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK",
                    "channel": "#alerts",
                    "username": "rUv-Swarm Alerts"
                }
            ),
            NotificationChannel(
                name="webhook",
                type="webhook",
                config={
                    "url": "https://your-webhook-endpoint.com/alerts",
                    "method": "POST",
                    "headers": {"Content-Type": "application/json"}
                }
            ),
            NotificationChannel(
                name="sms",
                type="sms", 
                config={
                    "service": "twilio",
                    "account_sid": "your_twilio_sid",
                    "auth_token": "your_twilio_token",
                    "from_number": "+1234567890",
                    "to_numbers": ["+1987654321", "+1555666777"]
                }
            )
        ]
        
        for channel in default_channels:
            self.add_notification_channel(channel)
    
    def add_alert_rule(self, rule: AlertRule):
        """Add or update an alert rule"""
        self.alert_rules[rule.name] = rule
        
        # Store in database
        self.conn.execute('''
            INSERT OR REPLACE INTO alert_rules VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            rule.name, rule.condition, rule.severity, rule.threshold_duration,
            rule.cooldown_period, json.dumps(rule.notification_channels),
            rule.enabled, rule.description, time.time(), time.time()
        ))
        self.conn.commit()
        
        logger.info(f"Added alert rule: {rule.name}")
    
    def add_notification_channel(self, channel: NotificationChannel):
        """Add or update a notification channel"""
        self.notification_channels[channel.name] = channel
        logger.info(f"Added notification channel: {channel.name}")
    
    def evaluate_conditions(self, metrics: Dict[str, Any]):
        """Evaluate all alert conditions against current metrics"""
        current_time = time.time()
        
        for rule_name, rule in self.alert_rules.items():
            if not rule.enabled:
                continue
            
            try:
                # Evaluate condition
                condition_met = self._evaluate_condition(rule.condition, metrics)
                
                # Track condition state
                if rule_name not in self.condition_states:
                    self.condition_states[rule_name] = {
                        'first_true': None,
                        'consecutive_true': 0,
                        'last_check': current_time
                    }
                
                state = self.condition_states[rule_name]
                
                if condition_met:
                    # Condition is true
                    if state['first_true'] is None:
                        state['first_true'] = current_time
                        state['consecutive_true'] = 1
                    else:
                        state['consecutive_true'] += 1
                    
                    # Check if threshold duration is met
                    duration_met = (current_time - state['first_true']) >= rule.threshold_duration
                    
                    # Check cooldown period
                    last_alert = self.last_alert_time.get(rule_name, 0)
                    cooldown_met = (current_time - last_alert) >= rule.cooldown_period
                    
                    if duration_met and cooldown_met:
                        # Trigger alert
                        self._trigger_alert(rule, metrics)
                        self.last_alert_time[rule_name] = current_time
                        
                        # Reset condition state
                        state['first_true'] = None
                        state['consecutive_true'] = 0
                else:
                    # Condition is false, reset state
                    state['first_true'] = None
                    state['consecutive_true'] = 0
                
                state['last_check'] = current_time
                
            except Exception as e:
                logger.error(f"Error evaluating rule {rule_name}: {e}")
    
    def _evaluate_condition(self, condition: str, metrics: Dict[str, Any]) -> bool:
        """Safely evaluate a condition string against metrics"""
        try:
            # Create a safe evaluation context
            safe_dict = {
                '__builtins__': {},
                'abs': abs, 'max': max, 'min': min, 'round': round,
                'len': len, 'sum': sum, 'all': all, 'any': any
            }
            safe_dict.update(metrics)
            
            # Evaluate the condition
            result = eval(condition, safe_dict)
            return bool(result)
            
        except Exception as e:
            logger.error(f"Error evaluating condition '{condition}': {e}")
            return False
    
    def _trigger_alert(self, rule: AlertRule, metrics: Dict[str, Any]):
        """Trigger an alert"""
        alert_id = f"{rule.name}_{int(time.time())}"
        
        # Create alert message
        message = self._generate_alert_message(rule, metrics)
        
        # Create alert object
        alert = Alert(
            id=alert_id,
            rule_name=rule.name,
            severity=rule.severity,
            message=message,
            timestamp=time.time(),
            metadata=metrics.copy()
        )
        
        # Store active alert
        self.active_alerts[alert_id] = alert
        self.alert_history.append(alert)
        
        # Store in database
        self.conn.execute('''
            INSERT INTO alert_history VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            alert.id, alert.rule_name, alert.severity, alert.message,
            alert.timestamp, alert.acknowledged, alert.resolved,
            alert.acknowledged_by, alert.resolved_by, json.dumps(alert.metadata)
        ))
        self.conn.commit()
        
        # Queue notifications
        for channel_name in rule.notification_channels:
            if channel_name in self.notification_channels:
                self.notification_queue.put((alert, channel_name))
        
        logger.warning(f"ALERT TRIGGERED: {rule.name} - {message}")
    
    def _generate_alert_message(self, rule: AlertRule, metrics: Dict[str, Any]) -> str:
        """Generate a human-readable alert message"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        message = f"🚨 ALERT: {rule.name.replace('_', ' ').title()}\n"
        message += f"Time: {timestamp}\n"
        message += f"Severity: {rule.severity.upper()}\n"
        message += f"Description: {rule.description}\n"
        message += f"Condition: {rule.condition}\n\n"
        
        # Add relevant metrics
        message += "Current Metrics:\n"
        for key, value in metrics.items():
            if isinstance(value, (int, float)):
                if key.endswith('_percent'):
                    message += f"  {key}: {value:.1f}%\n"
                elif key.endswith('_ms'):
                    message += f"  {key}: {value:.1f}ms\n"
                elif key.endswith('_mb'):
                    message += f"  {key}: {value:.1f}MB\n"
                else:
                    message += f"  {key}: {value}\n"
            else:
                message += f"  {key}: {value}\n"
        
        return message
    
    def acknowledge_alert(self, alert_id: str, acknowledged_by: str):
        """Acknowledge an alert"""
        if alert_id in self.active_alerts:
            alert = self.active_alerts[alert_id]
            alert.acknowledged = True
            alert.acknowledged_by = acknowledged_by
            
            # Update database
            self.conn.execute('''
                UPDATE alert_history SET acknowledged = ?, acknowledged_by = ? WHERE id = ?
            ''', (True, acknowledged_by, alert_id))
            self.conn.commit()
            
            logger.info(f"Alert {alert_id} acknowledged by {acknowledged_by}")
    
    def resolve_alert(self, alert_id: str, resolved_by: str):
        """Resolve an alert"""
        if alert_id in self.active_alerts:
            alert = self.active_alerts[alert_id]
            alert.resolved = True
            alert.resolved_by = resolved_by
            
            # Remove from active alerts
            del self.active_alerts[alert_id]
            
            # Update database
            self.conn.execute('''
                UPDATE alert_history SET resolved = ?, resolved_by = ? WHERE id = ?
            ''', (True, resolved_by, alert_id))
            self.conn.commit()
            
            logger.info(f"Alert {alert_id} resolved by {resolved_by}")
    
    def send_notification(self, alert: Alert, channel_name: str):
        """Send notification through specified channel"""
        if channel_name not in self.notification_channels:
            logger.error(f"Notification channel {channel_name} not found")
            return
        
        channel = self.notification_channels[channel_name]
        if not channel.enabled:
            return
        
        try:
            if channel.type == "email":
                self._send_email_notification(alert, channel)
            elif channel.type == "slack":
                self._send_slack_notification(alert, channel)
            elif channel.type == "webhook":
                self._send_webhook_notification(alert, channel)
            elif channel.type == "sms":
                self._send_sms_notification(alert, channel)
            
            # Log successful notification
            self.conn.execute('''
                INSERT INTO notification_log VALUES (NULL, ?, ?, ?, ?, NULL)
            ''', (alert.id, channel_name, "success", time.time()))
            self.conn.commit()
            
            logger.info(f"Notification sent via {channel_name} for alert {alert.id}")
            
        except Exception as e:
            # Log failed notification
            self.conn.execute('''
                INSERT INTO notification_log VALUES (NULL, ?, ?, ?, ?, ?)
            ''', (alert.id, channel_name, "failed", time.time(), str(e)))
            self.conn.commit()
            
            logger.error(f"Failed to send notification via {channel_name}: {e}")
    
    def _send_email_notification(self, alert: Alert, channel: NotificationChannel):
        """Send email notification"""
        config = channel.config
        
        msg = MimeMultipart()
        msg['From'] = config['from_email']
        msg['To'] = ', '.join(config['to_emails'])
        msg['Subject'] = f"[{alert.severity.upper()}] rUv-Swarm Alert: {alert.rule_name}"
        
        # Create HTML email body
        html_body = f"""
        <html>
        <body>
            <h2 style="color: {'red' if alert.severity == 'critical' else 'orange' if alert.severity == 'high' else 'blue'};">
                🚨 rUv-Swarm System Alert
            </h2>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
                <pre>{alert.message}</pre>
            </div>
            <p><strong>Alert ID:</strong> {alert.id}</p>
            <p><strong>Timestamp:</strong> {datetime.fromtimestamp(alert.timestamp)}</p>
            <hr>
            <p><em>This is an automated alert from the rUv-Swarm Course monitoring system.</em></p>
        </body>
        </html>
        """
        
        msg.attach(MimeText(html_body, 'html'))
        
        # Send email (Note: In production, use proper email credentials)
        try:
            server = smtplib.SMTP(config['smtp_server'], config['smtp_port'])
            server.starttls()
            # server.login(config['username'], config['password'])
            # server.send_message(msg)
            server.quit()
            logger.info("Email notification sent (simulated)")
        except Exception as e:
            logger.error(f"Email sending failed: {e}")
            # Simulate successful send for demo
            logger.info("Email notification simulated successfully")
    
    def _send_slack_notification(self, alert: Alert, channel: NotificationChannel):
        """Send Slack notification"""
        config = channel.config
        
        # Create Slack message payload
        color = {
            'critical': 'danger',
            'high': 'warning', 
            'medium': 'warning',
            'low': 'good'
        }.get(alert.severity, 'warning')
        
        payload = {
            'channel': config.get('channel', '#alerts'),
            'username': config.get('username', 'rUv-Swarm Alerts'),
            'icon_emoji': ':warning:',
            'attachments': [{
                'color': color,
                'title': f"{alert.severity.upper()} Alert: {alert.rule_name}",
                'text': alert.message,
                'fields': [
                    {
                        'title': 'Alert ID',
                        'value': alert.id,
                        'short': True
                    },
                    {
                        'title': 'Timestamp',
                        'value': datetime.fromtimestamp(alert.timestamp).strftime('%Y-%m-%d %H:%M:%S'),
                        'short': True
                    }
                ],
                'footer': 'rUv-Swarm Monitoring',
                'ts': int(alert.timestamp)
            }]
        }
        
        # Send to Slack (simulated for demo)
        try:
            # response = requests.post(config['webhook_url'], json=payload, timeout=10)
            # response.raise_for_status()
            logger.info("Slack notification sent (simulated)")
        except Exception as e:
            logger.error(f"Slack notification failed: {e}")
    
    def _send_webhook_notification(self, alert: Alert, channel: NotificationChannel):
        """Send webhook notification"""
        config = channel.config
        
        payload = {
            'alert_id': alert.id,
            'rule_name': alert.rule_name,
            'severity': alert.severity,
            'message': alert.message,
            'timestamp': alert.timestamp,
            'metadata': alert.metadata
        }
        
        headers = config.get('headers', {})
        
        try:
            # response = requests.request(
            #     config.get('method', 'POST'),
            #     config['url'],
            #     json=payload,
            #     headers=headers,
            #     timeout=10
            # )
            # response.raise_for_status()
            logger.info("Webhook notification sent (simulated)")
        except Exception as e:
            logger.error(f"Webhook notification failed: {e}")
    
    def _send_sms_notification(self, alert: Alert, channel: NotificationChannel):
        """Send SMS notification"""
        config = channel.config
        
        # Create short SMS message
        sms_message = f"rUv-Swarm ALERT [{alert.severity.upper()}]: {alert.rule_name} - {datetime.fromtimestamp(alert.timestamp).strftime('%H:%M')}"
        
        try:
            # In production, integrate with Twilio or similar service
            # client = Client(config['account_sid'], config['auth_token'])
            # for to_number in config['to_numbers']:
            #     client.messages.create(
            #         body=sms_message,
            #         from_=config['from_number'],
            #         to=to_number
            #     )
            logger.info("SMS notification sent (simulated)")
        except Exception as e:
            logger.error(f"SMS notification failed: {e}")
    
    def start_alert_engine(self):
        """Start the alert processing engine"""
        def notification_worker():
            """Process notification queue"""
            while True:
                try:
                    alert, channel_name = self.notification_queue.get(timeout=1)
                    self.send_notification(alert, channel_name)
                    self.notification_queue.task_done()
                except queue.Empty:
                    continue
                except Exception as e:
                    logger.error(f"Notification worker error: {e}")
        
        # Start notification worker thread
        threading.Thread(target=notification_worker, daemon=True).start()
        logger.info("Alert engine started")
    
    def get_alert_summary(self) -> Dict[str, Any]:
        """Get alert system summary"""
        now = time.time()
        hour_ago = now - 3600
        day_ago = now - 86400
        
        # Count alerts by severity and time
        alerts_last_hour = [a for a in self.alert_history if a.timestamp > hour_ago]
        alerts_last_day = [a for a in self.alert_history if a.timestamp > day_ago]
        
        severity_counts = defaultdict(int)
        for alert in alerts_last_day:
            severity_counts[alert.severity] += 1
        
        return {
            'active_alerts': len(self.active_alerts),
            'total_rules': len([r for r in self.alert_rules.values() if r.enabled]),
            'alerts_last_hour': len(alerts_last_hour),
            'alerts_last_day': len(alerts_last_day),
            'severity_distribution': dict(severity_counts),
            'notification_channels': len([c for c in self.notification_channels.values() if c.enabled]),
            'unacknowledged_alerts': len([a for a in self.active_alerts.values() if not a.acknowledged])
        }
    
    def simulate_metrics_and_alerts(self):
        """Simulate system metrics and trigger alerts for demo"""
        def simulation_loop():
            while True:
                try:
                    # Simulate system metrics
                    metrics = {
                        'cpu_percent': psutil.cpu_percent(),
                        'memory_percent': psutil.virtual_memory().percent,
                        'disk_usage': psutil.disk_usage('/').percent,
                        'system_status': 'online',
                        'avg_execution_time': 150 + (time.time() % 100) * 20,  # Varying execution time
                        'error_rate': max(0, 5 + (time.time() % 50) - 25),  # Varying error rate
                        'failed_logins_per_minute': max(0, int((time.time() % 30) - 15)),  # Occasional spikes
                    }
                    
                    # Occasionally simulate high values to trigger alerts
                    if time.time() % 120 < 10:  # Every 2 minutes for 10 seconds
                        metrics['cpu_percent'] = 85 + (time.time() % 10)
                    
                    if time.time() % 180 < 15:  # Every 3 minutes for 15 seconds
                        metrics['memory_percent'] = 90 + (time.time() % 5)
                    
                    if time.time() % 300 < 5:  # Every 5 minutes for 5 seconds
                        metrics['error_rate'] = 15 + (time.time() % 5)
                    
                    # Evaluate alert conditions
                    self.evaluate_conditions(metrics)
                    
                    time.sleep(5)  # Check every 5 seconds
                    
                except Exception as e:
                    logger.error(f"Simulation error: {e}")
                    time.sleep(10)
        
        threading.Thread(target=simulation_loop, daemon=True).start()
        logger.info("Alert simulation started")

def main():
    """Main function for testing the alert system"""
    print("🚨 rUv-Swarm Course Alert System")
    print("=" * 50)
    
    # Initialize alert engine
    alert_engine = AlertEngine()
    
    # Start simulation
    alert_engine.simulate_metrics_and_alerts()
    
    print("Alert system running...")
    print("- Monitoring system metrics")
    print("- Evaluating alert conditions")
    print("- Sending notifications (simulated)")
    print("\nPress Ctrl+C to stop")
    
    try:
        while True:
            # Display alert summary every 30 seconds
            time.sleep(30)
            summary = alert_engine.get_alert_summary()
            
            print(f"\n📊 Alert Summary ({datetime.now().strftime('%H:%M:%S')})")
            print(f"  Active Alerts: {summary['active_alerts']}")
            print(f"  Alerts (last hour): {summary['alerts_last_hour']}")
            print(f"  Alerts (last day): {summary['alerts_last_day']}")
            print(f"  Unacknowledged: {summary['unacknowledged_alerts']}")
            
            if summary['severity_distribution']:
                print("  Severity Distribution:")
                for severity, count in summary['severity_distribution'].items():
                    print(f"    {severity}: {count}")
            
            # Show active alerts
            if alert_engine.active_alerts:
                print("  🔥 Active Alerts:")
                for alert_id, alert in alert_engine.active_alerts.items():
                    status = "ACK" if alert.acknowledged else "NEW"
                    print(f"    [{alert.severity.upper()}] {alert.rule_name} ({status})")
    
    except KeyboardInterrupt:
        print("\n\nShutting down alert system...")
        logger.info("Alert system stopped")

if __name__ == '__main__':
    main()