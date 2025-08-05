# rUv-Swarm Platform Diagnostic Tests

Please run these tests and share the results:

## 1. Backend API Health Check
```bash
curl -v http://localhost:8000/api/health/
```

## 2. Test Code Execution API Directly
```bash
curl -X POST http://localhost:8000/api/code/execute \
  -H "Content-Type: application/json" \
  -d '{"code": "console.log(\"Hello World\");", "language": "javascript"}'
```

## 3. Check Backend Logs for Errors
```bash
tail -20 /tmp/backend.log
```

## 4. Test Frontend Proxy
```bash
curl http://localhost:5173/api/health/
```

## 5. Check Code Execution Response Structure
```bash
curl -X POST http://localhost:8000/api/code/execute \
  -H "Content-Type: application/json" \
  -d '{"code": "console.log(\"test\");", "language": "javascript"}' | jq '.'
```

## 6. Check Frontend Console for API Calls
In the browser Developer Console, run:
```javascript
// Test API directly from console
fetch('/api/code/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code: 'console.log("test")', language: 'javascript' })
}).then(r => r.json()).then(console.log).catch(console.error)
```

## 7. Check Network Tab
1. Open Developer Tools > Network tab
2. Try running code in the editor
3. Look for the `/api/code/execute` request
4. Check the Response tab for the actual response

## 8. Test Swarm Functionality
Check if the swarm page exists:
```bash
curl -s http://localhost:5173/swarm | grep -o "<title>.*</title>"
```

## 9. Check Frontend Routes
```bash
# Check if swarm route is defined
grep -r "swarm" /workspaces/sparc-evolution/rUv-swarm-course/frontend/src/App.jsx
```

## 10. Browser Console Errors
Please share any errors that appear in the browser console when you:
1. Load the page
2. Try to execute code
3. Click "Join Swarm"

## Additional Information Needed:
1. What code are you trying to execute in the editor?
2. What language is selected?
3. Does the loading spinner appear when you click "Run Code"?
4. What happens exactly when you click "Join Swarm"? (Nothing at all, or a brief flash?)