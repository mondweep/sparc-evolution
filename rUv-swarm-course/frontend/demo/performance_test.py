#!/usr/bin/env python3
"""
rUv-Swarm Course Performance Testing Suite
Load testing, stress testing, and performance validation
"""

import asyncio
import time
import json
import threading
import logging
import statistics
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, asdict
from typing import List, Dict, Any, Optional, Callable
import requests
import websocket
import random
import subprocess
import psutil
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class TestResult:
    """Individual test result"""
    test_name: str
    start_time: float
    end_time: float
    duration_ms: float
    success: bool
    status_code: Optional[int] = None
    response_size: Optional[int] = None
    error_message: Optional[str] = None

@dataclass
class LoadTestResults:
    """Load test results summary"""
    test_name: str
    total_requests: int
    successful_requests: int
    failed_requests: int
    avg_response_time: float
    min_response_time: float
    max_response_time: float
    median_response_time: float
    p95_response_time: float
    p99_response_time: float
    requests_per_second: float
    error_rate: float
    throughput_mb_per_sec: float

@dataclass
class SystemResourceUsage:
    """System resource usage during tests"""
    timestamp: float
    cpu_percent: float
    memory_percent: float
    memory_mb: float
    disk_io_read: int
    disk_io_write: int
    network_sent: int
    network_recv: int

class PerformanceTester:
    """Main performance testing class"""
    
    def __init__(self, base_url: str = "http://localhost:3000"):
        self.base_url = base_url
        self.session = requests.Session()
        self.resource_usage: List[SystemResourceUsage] = []
        self.monitoring = False
        
        # Test endpoints
        self.endpoints = {
            'homepage': '/',
            'dashboard': '/dashboard',
            'courses': '/courses',
            'editor': '/editor',
            'api_lessons': '/api/lessons',
            'api_progress': '/api/progress',
            'api_execute': '/api/execute',
            'api_save': '/api/save'
        }
        
        # Sample test data
        self.test_users = [
            {'id': f'test_user_{i}', 'name': f'Test User {i}'} 
            for i in range(1, 101)
        ]
        
        self.code_samples = [
            {
                'language': 'python',
                'code': '''
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
'''
            },
            {
                'language': 'javascript',
                'code': '''
function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));
'''
            },
            {
                'language': 'java',
                'code': '''
public class QuickSort {
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        quickSort(arr, 0, arr.length - 1);
        System.out.println(Arrays.toString(arr));
    }
    
    static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
}
'''
            }
        ]
    
    def start_resource_monitoring(self):
        """Start monitoring system resources"""
        self.monitoring = True
        
        def monitor_loop():
            while self.monitoring:
                try:
                    # Get system metrics
                    cpu_percent = psutil.cpu_percent(interval=1)
                    memory = psutil.virtual_memory()
                    disk_io = psutil.disk_io_counters()
                    network_io = psutil.net_io_counters()
                    
                    usage = SystemResourceUsage(
                        timestamp=time.time(),
                        cpu_percent=cpu_percent,
                        memory_percent=memory.percent,
                        memory_mb=memory.used / (1024 * 1024),
                        disk_io_read=disk_io.read_bytes,
                        disk_io_write=disk_io.write_bytes,
                        network_sent=network_io.bytes_sent,
                        network_recv=network_io.bytes_recv
                    )
                    
                    self.resource_usage.append(usage)
                    
                    # Keep only last 1000 readings
                    if len(self.resource_usage) > 1000:
                        self.resource_usage.pop(0)
                    
                    time.sleep(1)
                    
                except Exception as e:
                    logger.error(f"Resource monitoring error: {e}")
                    time.sleep(5)
        
        threading.Thread(target=monitor_loop, daemon=True).start()
        logger.info("Resource monitoring started")
    
    def stop_resource_monitoring(self):
        """Stop monitoring system resources"""
        self.monitoring = False
        logger.info("Resource monitoring stopped")
    
    def make_request(self, method: str, url: str, **kwargs) -> TestResult:
        """Make a single HTTP request and measure performance"""
        start_time = time.time()
        test_name = f"{method} {url}"
        
        try:
            response = self.session.request(method, url, timeout=30, **kwargs)
            end_time = time.time()
            duration_ms = (end_time - start_time) * 1000
            
            return TestResult(
                test_name=test_name,
                start_time=start_time,
                end_time=end_time,
                duration_ms=duration_ms,
                success=response.status_code < 400,
                status_code=response.status_code,
                response_size=len(response.content) if response.content else 0
            )
            
        except Exception as e:
            end_time = time.time()
            duration_ms = (end_time - start_time) * 1000
            
            return TestResult(
                test_name=test_name,
                start_time=start_time,
                end_time=end_time,
                duration_ms=duration_ms,
                success=False,
                error_message=str(e)
            )
    
    def simulate_user_session(self, user_id: str, session_duration: int = 300) -> List[TestResult]:
        """Simulate a complete user session"""
        results = []
        session_start = time.time()
        
        logger.info(f"Starting session for user {user_id}")
        
        # 1. Login/Homepage
        result = self.make_request('GET', f"{self.base_url}/")
        results.append(result)
        
        # 2. Navigate to dashboard
        time.sleep(random.uniform(1, 3))
        result = self.make_request('GET', f"{self.base_url}/dashboard")
        results.append(result)
        
        # 3. Load courses
        time.sleep(random.uniform(2, 5))
        result = self.make_request('GET', f"{self.base_url}/api/lessons")
        results.append(result)
        
        # 4. Multiple lesson interactions
        for _ in range(random.randint(3, 8)):
            if time.time() - session_start > session_duration:
                break
            
            # View lesson
            lesson_id = random.randint(1, 20)
            result = self.make_request('GET', f"{self.base_url}/api/lessons/{lesson_id}")
            results.append(result)
            
            time.sleep(random.uniform(5, 15))  # Reading time
            
            # Execute code
            code_sample = random.choice(self.code_samples)
            payload = {
                'language': code_sample['language'],
                'code': code_sample['code'],
                'user_id': user_id
            }
            
            result = self.make_request('POST', f"{self.base_url}/api/execute", json=payload)
            results.append(result)
            
            time.sleep(random.uniform(2, 8))
            
            # Save progress
            progress_data = {
                'user_id': user_id,
                'lesson_id': lesson_id,
                'progress': random.randint(50, 100),
                'completed': random.choice([True, False])
            }
            
            result = self.make_request('POST', f"{self.base_url}/api/progress", json=progress_data)
            results.append(result)
            
            time.sleep(random.uniform(1, 4))
        
        logger.info(f"Completed session for user {user_id}: {len(results)} requests")
        return results
    
    def load_test_endpoint(self, endpoint: str, num_requests: int = 100, 
                          concurrent_users: int = 10) -> LoadTestResults:
        """Load test a specific endpoint"""
        logger.info(f"Load testing {endpoint} with {num_requests} requests, {concurrent_users} concurrent users")
        
        url = f"{self.base_url}{endpoint}"
        results = []
        
        def make_test_request():
            return self.make_request('GET', url)
        
        start_time = time.time()
        
        with ThreadPoolExecutor(max_workers=concurrent_users) as executor:
            futures = [executor.submit(make_test_request) for _ in range(num_requests)]
            
            for future in as_completed(futures):
                try:
                    result = future.result()
                    results.append(result)
                except Exception as e:
                    logger.error(f"Request failed: {e}")
        
        end_time = time.time()
        total_duration = end_time - start_time
        
        # Calculate statistics
        successful_results = [r for r in results if r.success]
        failed_results = [r for r in results if not r.success]
        
        if successful_results:
            response_times = [r.duration_ms for r in successful_results]
            total_response_size = sum(r.response_size or 0 for r in successful_results)
            
            load_results = LoadTestResults(
                test_name=f"Load Test: {endpoint}",
                total_requests=len(results),
                successful_requests=len(successful_results),
                failed_requests=len(failed_results),
                avg_response_time=statistics.mean(response_times),
                min_response_time=min(response_times),
                max_response_time=max(response_times),
                median_response_time=statistics.median(response_times),
                p95_response_time=self.percentile(response_times, 95),
                p99_response_time=self.percentile(response_times, 99),
                requests_per_second=len(results) / total_duration,
                error_rate=(len(failed_results) / len(results)) * 100,
                throughput_mb_per_sec=(total_response_size / (1024 * 1024)) / total_duration
            )
        else:
            load_results = LoadTestResults(
                test_name=f"Load Test: {endpoint}",
                total_requests=len(results),
                successful_requests=0,
                failed_requests=len(results),
                avg_response_time=0,
                min_response_time=0,
                max_response_time=0,
                median_response_time=0,
                p95_response_time=0,
                p99_response_time=0,
                requests_per_second=0,
                error_rate=100,
                throughput_mb_per_sec=0
            )
        
        return load_results
    
    def stress_test_concurrent_users(self, max_users: int = 50, ramp_up_time: int = 300) -> Dict:
        """Stress test with gradually increasing concurrent users"""
        logger.info(f"Starting stress test: ramping up to {max_users} users over {ramp_up_time} seconds")
        
        self.start_resource_monitoring()
        
        results = []
        user_threads = []
        
        # Gradually ramp up users
        for user_count in range(1, max_users + 1):
            user_id = f"stress_user_{user_count}"
            
            # Start user session in separate thread
            def run_user_session(uid):
                session_results = self.simulate_user_session(uid, session_duration=ramp_up_time)
                results.extend(session_results)
            
            thread = threading.Thread(target=run_user_session, args=(user_id,))
            thread.start()
            user_threads.append(thread)
            
            # Wait before adding next user
            time.sleep(ramp_up_time / max_users)
            
            logger.info(f"Ramped up to {user_count} concurrent users")
        
        # Wait for all users to complete
        for thread in user_threads:
            thread.join()
        
        self.stop_resource_monitoring()
        
        # Analyze results
        successful_requests = [r for r in results if r.success]
        failed_requests = [r for r in results if not r.success]
        
        stress_results = {
            'test_type': 'Stress Test - Concurrent Users',
            'max_concurrent_users': max_users,
            'total_requests': len(results),
            'successful_requests': len(successful_requests),
            'failed_requests': len(failed_requests),
            'error_rate': (len(failed_requests) / len(results)) * 100 if results else 0,
            'avg_response_time': statistics.mean([r.duration_ms for r in successful_requests]) if successful_requests else 0,
            'resource_usage_peak': self.get_peak_resource_usage(),
            'resource_usage_avg': self.get_average_resource_usage()
        }
        
        return stress_results
    
    def benchmark_code_execution(self, num_executions: int = 100) -> Dict:
        """Benchmark code execution performance"""
        logger.info(f"Benchmarking code execution with {num_executions} executions")
        
        results_by_language = {}
        
        for language_data in self.code_samples:
            language = language_data['language']
            code = language_data['code']
            
            logger.info(f"Testing {language} code execution")
            results = []
            
            for i in range(num_executions):
                payload = {
                    'language': language,
                    'code': code,
                    'user_id': f'benchmark_user_{i}'
                }
                
                result = self.make_request('POST', f"{self.base_url}/api/execute", json=payload)
                results.append(result)
                
                if i % 10 == 0:
                    logger.info(f"Completed {i+1}/{num_executions} {language} executions")
                
                time.sleep(0.1)  # Small delay to avoid overwhelming
            
            # Calculate statistics for this language
            successful_results = [r for r in results if r.success]
            
            if successful_results:
                response_times = [r.duration_ms for r in successful_results]
                
                results_by_language[language] = {
                    'total_executions': len(results),
                    'successful_executions': len(successful_results),
                    'failed_executions': len(results) - len(successful_results),
                    'success_rate': (len(successful_results) / len(results)) * 100,
                    'avg_execution_time': statistics.mean(response_times),
                    'min_execution_time': min(response_times),
                    'max_execution_time': max(response_times),
                    'median_execution_time': statistics.median(response_times),
                    'p95_execution_time': self.percentile(response_times, 95),
                    'p99_execution_time': self.percentile(response_times, 99)
                }
        
        return {
            'test_type': 'Code Execution Benchmark',
            'total_executions': num_executions * len(self.code_samples),
            'results_by_language': results_by_language
        }
    
    def test_websocket_performance(self, num_connections: int = 20, 
                                 messages_per_connection: int = 50) -> Dict:
        """Test WebSocket connection performance"""
        logger.info(f"Testing WebSocket performance: {num_connections} connections, {messages_per_connection} messages each")
        
        results = []
        
        def websocket_test(connection_id):
            try:
                ws_url = self.base_url.replace('http', 'ws') + '/ws'
                ws = websocket.create_connection(ws_url, timeout=10)
                
                connection_results = []
                
                for i in range(messages_per_connection):
                    start_time = time.time()
                    
                    # Send message
                    message = {
                        'type': 'code_execute',
                        'data': {
                            'language': 'python',
                            'code': f'print("Hello from connection {connection_id}, message {i}")'
                        }
                    }
                    
                    ws.send(json.dumps(message))
                    response = ws.recv()
                    
                    end_time = time.time()
                    duration_ms = (end_time - start_time) * 1000
                    
                    connection_results.append({
                        'connection_id': connection_id,
                        'message_id': i,
                        'duration_ms': duration_ms,
                        'success': True
                    })
                    
                    time.sleep(0.1)
                
                ws.close()
                return connection_results
                
            except Exception as e:
                logger.error(f"WebSocket connection {connection_id} failed: {e}")
                return [{'connection_id': connection_id, 'success': False, 'error': str(e)}]
        
        # Run WebSocket tests concurrently
        with ThreadPoolExecutor(max_workers=num_connections) as executor:
            futures = [executor.submit(websocket_test, i) for i in range(num_connections)]
            
            for future in as_completed(futures):
                try:
                    connection_results = future.result()
                    results.extend(connection_results)
                except Exception as e:
                    logger.error(f"WebSocket test failed: {e}")
        
        # Analyze results
        successful_messages = [r for r in results if r.get('success', False)]
        failed_messages = [r for r in results if not r.get('success', False)]
        
        if successful_messages:
            response_times = [r['duration_ms'] for r in successful_messages]
            
            websocket_results = {
                'test_type': 'WebSocket Performance Test',
                'total_connections': num_connections,
                'messages_per_connection': messages_per_connection,
                'total_messages': len(results),
                'successful_messages': len(successful_messages),
                'failed_messages': len(failed_messages),
                'success_rate': (len(successful_messages) / len(results)) * 100,
                'avg_response_time': statistics.mean(response_times),
                'min_response_time': min(response_times),
                'max_response_time': max(response_times),
                'median_response_time': statistics.median(response_times),
                'p95_response_time': self.percentile(response_times, 95)
            }
        else:
            websocket_results = {
                'test_type': 'WebSocket Performance Test',
                'total_connections': num_connections,
                'total_messages': len(results),
                'successful_messages': 0,
                'failed_messages': len(results),
                'success_rate': 0
            }
        
        return websocket_results
    
    def run_comprehensive_test_suite(self) -> Dict:
        """Run the complete performance test suite"""
        logger.info("Starting comprehensive performance test suite")
        
        test_results = {
            'timestamp': datetime.now().isoformat(),
            'test_suite': 'rUv-Swarm Course Performance Tests',
            'tests': {}
        }
        
        # 1. Load test main endpoints
        logger.info("Running load tests on main endpoints")
        for endpoint_name, endpoint_path in self.endpoints.items():
            try:
                load_result = self.load_test_endpoint(endpoint_path, num_requests=50, concurrent_users=5)
                test_results['tests'][f'load_test_{endpoint_name}'] = asdict(load_result)
            except Exception as e:
                logger.error(f"Load test failed for {endpoint_name}: {e}")
                test_results['tests'][f'load_test_{endpoint_name}'] = {'error': str(e)}
        
        # 2. Stress test concurrent users
        logger.info("Running stress test with concurrent users")
        try:
            stress_result = self.stress_test_concurrent_users(max_users=20, ramp_up_time=120)
            test_results['tests']['stress_test_concurrent_users'] = stress_result
        except Exception as e:
            logger.error(f"Stress test failed: {e}")
            test_results['tests']['stress_test_concurrent_users'] = {'error': str(e)}
        
        # 3. Code execution benchmark
        logger.info("Running code execution benchmark")
        try:
            benchmark_result = self.benchmark_code_execution(num_executions=30)
            test_results['tests']['code_execution_benchmark'] = benchmark_result
        except Exception as e:
            logger.error(f"Code execution benchmark failed: {e}")
            test_results['tests']['code_execution_benchmark'] = {'error': str(e)}
        
        # 4. WebSocket performance test
        logger.info("Running WebSocket performance test")
        try:
            websocket_result = self.test_websocket_performance(num_connections=10, messages_per_connection=20)
            test_results['tests']['websocket_performance'] = websocket_result
        except Exception as e:
            logger.error(f"WebSocket test failed: {e}")
            test_results['tests']['websocket_performance'] = {'error': str(e)}
        
        logger.info("Comprehensive test suite completed")
        return test_results
    
    def percentile(self, data: List[float], percentile: float) -> float:
        """Calculate percentile of a list of numbers"""
        if not data:
            return 0
        sorted_data = sorted(data)
        index = (percentile / 100) * (len(sorted_data) - 1)
        if index.is_integer():
            return sorted_data[int(index)]
        else:
            lower = sorted_data[int(index)]
            upper = sorted_data[int(index) + 1]
            return lower + (upper - lower) * (index - int(index))
    
    def get_peak_resource_usage(self) -> Dict:
        """Get peak resource usage during tests"""
        if not self.resource_usage:
            return {}
        
        peak_cpu = max(self.resource_usage, key=lambda x: x.cpu_percent)
        peak_memory = max(self.resource_usage, key=lambda x: x.memory_percent)
        
        return {
            'peak_cpu_percent': peak_cpu.cpu_percent,
            'peak_cpu_timestamp': datetime.fromtimestamp(peak_cpu.timestamp).isoformat(),
            'peak_memory_percent': peak_memory.memory_percent,
            'peak_memory_mb': peak_memory.memory_mb,
            'peak_memory_timestamp': datetime.fromtimestamp(peak_memory.timestamp).isoformat()
        }
    
    def get_average_resource_usage(self) -> Dict:
        """Get average resource usage during tests"""
        if not self.resource_usage:
            return {}
        
        avg_cpu = statistics.mean([r.cpu_percent for r in self.resource_usage])
        avg_memory = statistics.mean([r.memory_percent for r in self.resource_usage])
        avg_memory_mb = statistics.mean([r.memory_mb for r in self.resource_usage])
        
        return {
            'avg_cpu_percent': avg_cpu,
            'avg_memory_percent': avg_memory,
            'avg_memory_mb': avg_memory_mb
        }
    
    def generate_report(self, results: Dict, output_file: str = 'performance_report.json'):
        """Generate detailed performance report"""
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2, default=str)
        
        logger.info(f"Performance report saved to {output_file}")
        
        # Generate summary
        print("\n" + "="*80)
        print("PERFORMANCE TEST SUMMARY")
        print("="*80)
        
        for test_name, test_data in results['tests'].items():
            print(f"\n{test_name.upper()}:")
            
            if 'error' in test_data:
                print(f"  ❌ FAILED: {test_data['error']}")
                continue
            
            if 'load_test' in test_name:
                print(f"  📊 Total Requests: {test_data['total_requests']}")
                print(f"  ✅ Success Rate: {100 - test_data['error_rate']:.1f}%")
                print(f"  ⚡ Avg Response Time: {test_data['avg_response_time']:.1f}ms")
                print(f"  🚀 Requests/sec: {test_data['requests_per_second']:.1f}")
                print(f"  📈 P95 Response Time: {test_data['p95_response_time']:.1f}ms")
            
            elif 'stress_test' in test_name:
                print(f"  👥 Max Concurrent Users: {test_data['max_concurrent_users']}")
                print(f"  📊 Total Requests: {test_data['total_requests']}")
                print(f"  ✅ Success Rate: {100 - test_data['error_rate']:.1f}%")
                print(f"  ⚡ Avg Response Time: {test_data['avg_response_time']:.1f}ms")
                if 'resource_usage_peak' in test_data:
                    peak = test_data['resource_usage_peak']
                    print(f"  🔥 Peak CPU: {peak.get('peak_cpu_percent', 0):.1f}%")
                    print(f"  💾 Peak Memory: {peak.get('peak_memory_percent', 0):.1f}%")
            
            elif 'code_execution' in test_name:
                print(f"  📝 Total Executions: {test_data['total_executions']}")
                for lang, lang_data in test_data['results_by_language'].items():
                    print(f"    {lang.upper()}:")
                    print(f"      ✅ Success Rate: {lang_data['success_rate']:.1f}%")
                    print(f"      ⚡ Avg Time: {lang_data['avg_execution_time']:.1f}ms")
                    print(f"      📈 P95 Time: {lang_data['p95_execution_time']:.1f}ms")
            
            elif 'websocket' in test_name:
                print(f"  🔌 Total Connections: {test_data['total_connections']}")
                print(f"  📨 Total Messages: {test_data['total_messages']}")
                print(f"  ✅ Success Rate: {test_data['success_rate']:.1f}%")
                print(f"  ⚡ Avg Response Time: {test_data['avg_response_time']:.1f}ms")
        
        print("\n" + "="*80)

def main():
    """Main entry point for performance testing"""
    import argparse
    
    parser = argparse.ArgumentParser(description='rUv-Swarm Course Performance Testing')
    parser.add_argument('--url', default='http://localhost:3000', help='Base URL for testing')
    parser.add_argument('--output', default='performance_report.json', help='Output report file')
    parser.add_argument('--quick', action='store_true', help='Run quick test suite')
    
    args = parser.parse_args()
    
    tester = PerformanceTester(base_url=args.url)
    
    if args.quick:
        # Quick test suite
        logger.info("Running quick test suite")
        results = {
            'timestamp': datetime.now().isoformat(),
            'test_suite': 'Quick Performance Tests',
            'tests': {}
        }
        
        # Test main endpoint only
        load_result = tester.load_test_endpoint('/', num_requests=20, concurrent_users=3)
        results['tests']['quick_load_test'] = asdict(load_result)
        
        # Quick code execution test
        benchmark_result = tester.benchmark_code_execution(num_executions=10)
        results['tests']['quick_code_benchmark'] = benchmark_result
    else:
        # Full test suite
        results = tester.run_comprehensive_test_suite()
    
    # Generate report
    tester.generate_report(results, args.output)

if __name__ == '__main__':
    main()