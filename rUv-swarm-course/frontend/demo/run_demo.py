#!/usr/bin/env python3
"""
rUv-Swarm Course Complete Monitoring Demonstration
Comprehensive system monitoring with real-time dashboards and performance testing
"""

import os
import sys
import time
import json
import threading
import subprocess
import logging
import argparse
from datetime import datetime
import webbrowser
from pathlib import Path

# Add current directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from system_monitor import SystemMonitor
    from alert_system import AlertEngine
except ImportError as e:
    print(f"Import error: {e}")
    print("Please ensure all required packages are installed:")
    print("pip install psutil flask flask-socketio plotly requests")
    sys.exit(1)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class DemoOrchestrator:
    """Orchestrates the complete monitoring demonstration"""
    
    def __init__(self):
        self.system_monitor = None
        self.alert_engine = None
        self.demo_processes = []
        self.demo_threads = []
        
        # Configuration
        self.config = {
            'monitor_port': 5000,
            'demo_duration': 300,  # 5 minutes default
            'auto_open_browser': True,
            'simulate_load': True,
            'simulate_alerts': True
        }
        
        self.demo_dir = Path(__file__).parent
        self.results_dir = self.demo_dir / 'results'
        self.results_dir.mkdir(exist_ok=True)
    
    def check_dependencies(self):
        """Check if all required dependencies are available"""
        required_packages = [
            'psutil', 'flask', 'flask_socketio', 'plotly', 'requests'
        ]
        
        missing = []
        for package in required_packages:
            try:
                __import__(package)
            except ImportError:
                missing.append(package)
        
        if missing:
            print("❌ Missing required packages:")
            print(f"   {', '.join(missing)}")
            print("\nInstall with:")
            print(f"   pip install {' '.join(missing)}")
            return False
        
        print("✅ All dependencies available")
        return True
    
    def start_system_monitor(self):
        """Start the system monitoring service"""
        try:
            print("🖥️  Starting System Monitor...")
            self.system_monitor = SystemMonitor()
            
            # Start in separate thread
            monitor_thread = threading.Thread(
                target=self.system_monitor.run,
                args=('0.0.0.0', self.config['monitor_port']),
                kwargs={'debug': False},
                daemon=True
            )
            monitor_thread.start()
            self.demo_threads.append(monitor_thread)
            
            # Wait a moment for server to start
            time.sleep(3)
            print(f"✅ System Monitor running on http://localhost:{self.config['monitor_port']}")
            
        except Exception as e:
            logger.error(f"Failed to start system monitor: {e}")
            return False
        
        return True
    
    def start_alert_system(self):
        """Start the alert monitoring system"""
        try:
            print("🚨 Starting Alert System...")
            self.alert_engine = AlertEngine()
            
            if self.config['simulate_alerts']:
                self.alert_engine.simulate_metrics_and_alerts()
            
            print("✅ Alert System active")
            
        except Exception as e:
            logger.error(f"Failed to start alert system: {e}")
            return False
        
        return True
    
    def simulate_user_load(self):
        """Simulate user load for demonstration"""
        if not self.config['simulate_load']:
            return
        
        def load_simulation():
            """Simulate various user activities"""
            try:
                print("👥 Starting user load simulation...")
                
                # Simulate user activities
                users = [f'demo_user_{i}' for i in range(1, 11)]
                activities = ['login', 'code_execute', 'lesson_complete', 'quiz_submit']
                languages = ['python', 'javascript', 'java', 'cpp']
                
                for cycle in range(60):  # Run for 5 minutes (60 * 5 seconds)
                    try:
                        # Log multiple user activities
                        for i in range(3):  # 3 activities per cycle
                            user = users[cycle % len(users)]
                            activity = activities[cycle % len(activities)]
                            session_id = f"session_{cycle}_{i}"
                            page = f"lesson_{(cycle % 10) + 1}"
                            
                            if hasattr(self.system_monitor, 'log_user_activity'):
                                self.system_monitor.log_user_activity(
                                    user, session_id, activity, page, 
                                    duration_seconds=30 + (cycle % 120)
                                )
                            
                            # Simulate code executions
                            if activity == 'code_execute':
                                exec_id = f"exec_{cycle}_{i}"
                                language = languages[i % len(languages)]
                                exec_time = 100 + (cycle * 20) % 800  # Varying execution times
                                memory_usage = 20 + (cycle * 5) % 80
                                success = (cycle % 10) != 9  # 90% success rate
                                
                                if hasattr(self.system_monitor, 'log_code_execution'):
                                    self.system_monitor.log_code_execution(
                                        exec_id, language, exec_time, memory_usage, success
                                    )
                        
                        time.sleep(5)  # 5 second intervals
                        
                    except Exception as e:
                        logger.error(f"Load simulation error: {e}")
                        time.sleep(1)
                
                print("✅ User load simulation completed")
                
            except Exception as e:
                logger.error(f"Load simulation failed: {e}")
        
        load_thread = threading.Thread(target=load_simulation, daemon=True)
        load_thread.start()
        self.demo_threads.append(load_thread)
    
    def run_performance_tests(self):
        """Run performance tests in background"""
        def performance_testing():
            try:
                print("⚡ Starting performance tests...")
                
                # Import and run performance tester
                from performance_test import PerformanceTester
                
                tester = PerformanceTester(base_url=f'http://localhost:{self.config["monitor_port"]}')
                
                # Run quick tests to avoid overwhelming the demo
                results = {
                    'timestamp': datetime.now().isoformat(),
                    'test_suite': 'Demo Performance Tests',
                    'tests': {}
                }
                
                # Quick system test
                try:
                    load_result = tester.load_test_endpoint('/', num_requests=20, concurrent_users=3)
                    results['tests']['quick_load_test'] = load_result.__dict__
                except Exception as e:
                    results['tests']['load_test_error'] = str(e)
                
                # Save results
                results_file = self.results_dir / f'performance_results_{int(time.time())}.json'
                with open(results_file, 'w') as f:
                    json.dump(results, f, indent=2, default=str)
                
                print(f"✅ Performance test results saved to {results_file}")
                
            except Exception as e:
                logger.error(f"Performance testing failed: {e}")
        
        perf_thread = threading.Thread(target=performance_testing, daemon=True)
        perf_thread.start()
        self.demo_threads.append(perf_thread)
    
    def generate_demo_report(self):
        """Generate a comprehensive demo report"""
        try:
            report = {
                'demo_info': {
                    'timestamp': datetime.now().isoformat(),
                    'duration_minutes': self.config['demo_duration'] / 60,
                    'components': [
                        'System Monitor',
                        'Alert System', 
                        'Performance Testing',
                        'Load Simulation'
                    ]
                },
                'urls': {
                    'system_monitor': f'http://localhost:{self.config["monitor_port"]}',
                    'dashboard': f'http://localhost:{self.config["monitor_port"]}/monitoring_dashboard.html'
                }
            }
            
            # Add system status if available
            if self.system_monitor:
                try:
                    report['system_summary'] = self.system_monitor.get_performance_summary()
                except:
                    pass
            
            # Add alert summary if available
            if self.alert_engine:
                try:
                    report['alert_summary'] = self.alert_engine.get_alert_summary()
                except:
                    pass
            
            # Save report
            report_file = self.results_dir / f'demo_report_{int(time.time())}.json'
            with open(report_file, 'w') as f:
                json.dump(report, f, indent=2, default=str)
            
            print(f"📋 Demo report saved to {report_file}")
            return report
            
        except Exception as e:
            logger.error(f"Failed to generate demo report: {e}")
            return {}
    
    def open_dashboard(self):
        """Open the monitoring dashboard in browser"""
        if not self.config['auto_open_browser']:
            return
        
        try:
            # Copy dashboard to monitor server directory
            dashboard_file = self.demo_dir / 'monitoring_dashboard.html'
            
            # Wait a moment for server to be ready
            time.sleep(2)
            
            # Open in browser
            dashboard_url = f'http://localhost:{self.config["monitor_port"]}'
            print(f"🌐 Opening dashboard: {dashboard_url}")
            
            # Try to open dashboard
            webbrowser.open(dashboard_url)
            
            # Also provide direct file access
            if dashboard_file.exists():
                file_url = f'file://{dashboard_file.absolute()}'
                print(f"📱 Alternative dashboard URL: {file_url}")
            
        except Exception as e:
            logger.error(f"Could not open browser: {e}")
            print(f"🌐 Manually open: http://localhost:{self.config['monitor_port']}")
    
    def print_demo_info(self):
        """Print demo information and instructions"""
        print("\n" + "="*80)
        print("🐝 rUv-Swarm Course System Monitoring Demo")
        print("="*80)
        print(f"📅 Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"⏱️  Duration: {self.config['demo_duration']} seconds")
        print(f"🌐 Monitor URL: http://localhost:{self.config['monitor_port']}")
        print(f"📊 Dashboard: http://localhost:{self.config['monitor_port']}/monitoring_dashboard.html")
        print("\n📋 Demo Components:")
        print("  ✅ Real-time System Monitoring")
        print("  ✅ Performance Metrics Collection")
        print("  ✅ User Activity Simulation")
        print("  ✅ Code Execution Tracking")
        print("  ✅ Alert System with Notifications")
        print("  ✅ Interactive Web Dashboard")
        print("  ✅ Performance Testing")
        print("\n🎯 What to Observe:")
        print("  • CPU and Memory usage graphs")
        print("  • Code execution performance metrics")
        print("  • User activity feed")
        print("  • Alert notifications when thresholds are exceeded")
        print("  • Database performance monitoring")
        print("  • Network traffic visualization")
        print("\n💡 Tips:")
        print("  • Refresh the dashboard to see real-time updates")
        print("  • Check the different tabs (Overview, Performance, Users, Security)")
        print("  • Watch for alert notifications in the alerts section")
        print("  • Monitor the console output for system events")
        print("\n" + "="*80)
    
    def run_demo(self, duration=300):
        """Run the complete monitoring demonstration"""
        self.config['demo_duration'] = duration
        
        print("🚀 Starting rUv-Swarm Course Monitoring Demo")
        
        # Check dependencies
        if not self.check_dependencies():
            return False
        
        try:
            # Start components
            if not self.start_system_monitor():
                return False
            
            if not self.start_alert_system():
                return False
            
            # Start simulations
            self.simulate_user_load()
            self.run_performance_tests()
            
            # Open dashboard
            self.open_dashboard()
            
            # Print demo information
            self.print_demo_info()
            
            # Run demo for specified duration
            print(f"\n⏳ Running demo for {duration} seconds...")
            print("Press Ctrl+C to stop early")
            
            start_time = time.time()
            
            try:
                while time.time() - start_time < duration:
                    elapsed = int(time.time() - start_time)
                    remaining = duration - elapsed
                    
                    # Print status every 30 seconds
                    if elapsed % 30 == 0 and elapsed > 0:
                        print(f"⏱️  Demo running... {remaining} seconds remaining")
                        
                        # Show some live stats
                        if self.system_monitor:
                            try:
                                summary = self.system_monitor.get_performance_summary()
                                print(f"   📊 Active Users: {summary['system']['active_users']}")
                                print(f"   ⚡ Code Executions: {summary['performance']['total_executions']}")
                                print(f"   ✅ Success Rate: {summary['performance']['success_rate_percent']:.1f}%")
                            except:
                                pass
                        
                        if self.alert_engine:
                            try:
                                alert_summary = self.alert_engine.get_alert_summary()
                                print(f"   🚨 Active Alerts: {alert_summary['active_alerts']}")
                            except:
                                pass
                    
                    time.sleep(1)
                    
            except KeyboardInterrupt:
                print("\n\n⏹️  Demo stopped by user")
            
            # Generate final report
            print("\n📋 Generating demo report...")
            report = self.generate_demo_report()
            
            print("\n✅ Demo completed successfully!")
            print("\n📊 Final Results:")
            
            if self.system_monitor:
                try:
                    final_summary = self.system_monitor.get_performance_summary()
                    print(f"  • Total Code Executions: {final_summary['performance']['total_executions']}")
                    print(f"  • Average Response Time: {final_summary['performance']['avg_execution_time_ms']:.1f}ms")
                    print(f"  • Success Rate: {final_summary['performance']['success_rate_percent']:.1f}%")
                    print(f"  • Peak Active Users: {final_summary['system']['active_users']}")
                except:
                    pass
            
            if self.alert_engine:
                try:
                    alert_summary = self.alert_engine.get_alert_summary()
                    print(f"  • Total Alerts (24h): {alert_summary['alerts_last_day']}")
                    print(f"  • Active Alert Rules: {alert_summary['total_rules']}")
                except:
                    pass
            
            print(f"\n📁 Results saved in: {self.results_dir}")
            print(f"🌐 Dashboard remains available at: http://localhost:{self.config['monitor_port']}")
            
            return True
            
        except Exception as e:
            logger.error(f"Demo failed: {e}")
            return False
    
    def cleanup(self):
        """Clean up demo resources"""
        print("\n🧹 Cleaning up demo resources...")
        
        # Stop processes
        for process in self.demo_processes:
            try:
                process.terminate()
                process.wait(timeout=5)
            except:
                pass
        
        # Note: Threads will stop when main process exits
        print("✅ Cleanup completed")

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description='rUv-Swarm Course Monitoring Demo')
    parser.add_argument('--duration', type=int, default=300, help='Demo duration in seconds (default: 300)')
    parser.add_argument('--port', type=int, default=5000, help='Monitor server port (default: 5000)')
    parser.add_argument('--no-browser', action='store_true', help='Don\'t auto-open browser')
    parser.add_argument('--no-load', action='store_true', help='Don\'t simulate user load')
    parser.add_argument('--no-alerts', action='store_true', help='Don\'t simulate alerts')
    
    args = parser.parse_args()
    
    # Create demo orchestrator
    demo = DemoOrchestrator()
    
    # Configure based on arguments
    demo.config.update({
        'monitor_port': args.port,
        'auto_open_browser': not args.no_browser,
        'simulate_load': not args.no_load,
        'simulate_alerts': not args.no_alerts
    })
    
    try:
        # Run the demo
        success = demo.run_demo(args.duration)
        
        if success:
            print("\n🎉 Demo completed successfully!")
            print("Thank you for trying the rUv-Swarm Course monitoring system!")
        else:
            print("\n❌ Demo failed to start properly")
            return 1
    
    except KeyboardInterrupt:
        print("\n\n⏹️  Demo interrupted by user")
    
    except Exception as e:
        logger.error(f"Demo error: {e}")
        return 1
    
    finally:
        demo.cleanup()
    
    return 0

if __name__ == '__main__':
    sys.exit(main())