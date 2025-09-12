# Semtools and MCP Learning Summary

## Semtools Installation and Setup

### Installation Process
1. **Initial Challenge**: Required Rust/Cargo version supporting Edition 2024
   - Original version: Cargo 1.68.2 (outdated)
   - Solution: Updated to Cargo 1.89.0 via `rustup update`

2. **Installation Command**:
   ```bash
   cargo install semtools
   ```

3. **Installed Executables**:
   - `parse` - Document parsing tool (located at `~/.cargo/bin/parse`)
   - `search` - Semantic search tool (located at `~/.cargo/bin/search`)

### Parse Tool Configuration

#### Configuration File Location
- Path: `~/.parse_config.json`

#### Required Configuration Structure
```json
{
  "api_key": "your_llama_cloud_api_key_here",
  "num_ongoing_requests": 10,
  "base_url": "https://api.cloud.llamaindex.ai",
  "check_interval": 5,
  "max_timeout": 3600,
  "max_retries": 10,
  "retry_delay_ms": 1000,
  "backoff_multiplier": 2.0,
  "parse_kwargs": {
    "parse_mode": "parse_page_with_agent",
    "model": "openai-gpt-4-1-mini",
    "high_res_ocr": "true",
    "adaptive_long_table": "true",
    "outlined_table_extraction": "true",
    "output_tables_as_HTML": "true"
  }
}
```

#### Key Configuration Learnings
- All fields are mandatory - missing any field causes errors
- Requires LlamaParse API key from cloud.llamaindex.ai
- Parse output is saved to `~/.parse/[filename].md`
- Supports advanced PDF parsing with OCR and table extraction

### Using Semtools

#### Parse Command
```bash
# Basic usage
parse "filename.pdf"

# With verbose output
parse --verbose "filename.pdf"

# Help
parse --help
```

**Features**:
- Converts PDFs to markdown format
- Extracts tables as HTML
- Handles complex layouts with AI assistance
- Preserves document structure

#### Search Command
```bash
# Basic semantic search
search "query terms" "file.md"

# With context lines
search "query" "file.md" -n 5

# Top-k results
search "query" "file.md" --top-k 5

# Help
search --help
```

**Features**:
- Semantic search (finds contextually relevant content)
- Returns similarity scores (lower = better match)
- Shows context around matches
- Supports multiple files/directories

### Practical Examples Performed

#### Example 1: Parsing the Adesso PDF
**Command Used:**
```bash
parse "adesso - Intro H2 2024.pdf"
```

**Result:** Successfully parsed to `/Users/mondweep/.parse/adesso - Intro H2 2024.pdf.md`

**Sample Parsed Content:**
```markdown
# INTRODUCTION ADESSO UK  
## THE COMPANY AND PORTFOLIO AT A GLANCE

## ADESSO | AT A GLANCE

> We specialise in creating software for a wide range of industries and technologies, actively playing a part in the digitisation of Europe.  
> With a dedicated team of over **10,000 EMPLOYEES** (adesso Group | Feb. 2024) across Europe, we have recently broadened our scope to include the UK market, starting just one year ago.

## GROUP REVENUE 2023
- approx. **1.1 B. Euros**

## NUMEROUS AWARDS
| Year | Award / Recognition                          |
|-------|---------------------------------------------|
| 2023  | Data, Analytics & AI Market Leader          |
| 2020  | [Award logo shown]                           |
```

#### Example 2: Semantic Search for Awards
**Command Used:**
```bash
search "awards achievements recognition excellence" "/Users/mondweep/.parse/adesso - Intro H2 2024.pdf.md"
```

**Results Found:**
```
/Users/mondweep/.parse/adesso - Intro H2 2024.pdf.md:446::453 (0.4192522861034296)
## Awards shown on trophies

- Beste Arbeitgeber ITK  
  Great Place To Work 2020  

/Users/mondweep/.parse/adesso - Intro H2 2024.pdf.md:27::34 (0.639156086580848)
## NUMEROUS AWARDS

| Year | Award / Recognition                          |
|-------|---------------------------------------------|
| 2023  | Data, Analytics & AI Market Leader          |
```

#### Example 3: Financial Performance Search
**Command Used:**
```bash
search "1.1 billion euros revenue" "/Users/mondweep/.parse/adesso - Intro H2 2024.pdf.md" --top-k 5
```

**Results Found:**
```
/Users/mondweep/.parse/adesso - Intro H2 2024.pdf.md:21::28 (0.5080750291633499)
## GROUP REVENUE 2023
- approx. **1.1 B. Euros**

/Users/mondweep/.parse/adesso - Intro H2 2024.pdf.md:10::17 (0.7265656264502557)
> With a dedicated team of over **10,000 EMPLOYEES** (adesso Group | Feb. 2024) across Europe, we have recently broadened our scope to include the UK market, starting just one year ago.
```

#### Example 4: Company Positioning Search
**Command Used:**
```bash
search "speed boat agility flexibility enterprise scalability" "/Users/mondweep/.parse/adesso - Intro H2 2024.pdf.md" -n 5
```

**Key Result Found:**
```
/Users/mondweep/.parse/adesso - Intro H2 2024.pdf.md:183::194 (0.4164071779051679)
> adesso combines the professionalism and scalability of a large IT company with the agility and flexibility of a small IT service provider and thus offers you ...

> * ...a pronounced **service provider mentality**!  
> * ...solution-oriented services with optimal **benefits**!  
> * ...pragmatic, **fast solutions** and hands-on mentality!  
> * ...a very high service quality designed for **speed**!  
> * ...extraordinary **flexibility** in cooperation!
> * ...fast and variable **scalability** in the services - both OnShore and with adesso SmartShore!

**WE JUST DO IT!**
```

### Key Discoveries from Parsed Content

**Company Overview:**
- Founded 1997 in Germany, became adesso SE in 2019
- Over 10,000 employees across Europe
- €1.1 billion revenue (2023)
- 64 locations in Europe & UK

**Major Clients Found:**
```
COMMERZBANK, DEUTSCHE BUNDESBANK, Bayern LB, Munich RE, MAN, DAIMLER, 
vodafone, T-Mobile, SwissLife, ZURICH, AOK, BARMER, Union Investment
```

**Industry Services Table Extracted:**
```html
<table>
  <tr>
    <td>Automotive</td>
    <td>Banking</td>
    <td>Health</td>
    <td>Insurance</td>
    <td>Life Sciences</td>
    <td>Manufacturing Industry</td>
    <td>Public</td>
    <td>Retail</td>
    <td>Utilities</td>
  </tr>
</table>
```

**Unique Value Proposition Discovered:**
The company positions itself as combining "Speed Boat" agility with "Big Player" enterprise capabilities - offering both the flexibility of a small service provider and the scalability of a large corporation.

## MCP (Model Context Protocol) Security Insights

### Why Terminal Access MCP is Unsafe

1. **Unrestricted Command Execution**
   - Can execute ANY system command
   - Same privileges as running user
   - Direct file system access

2. **No Sandboxing**
   - Runs directly on host system
   - No container/VM isolation
   - Can affect other processes

3. **Security Risks**
   - Privilege escalation potential
   - Remote code execution vector
   - Data exfiltration capabilities
   - Lack of audit trails

### Safer MCP Usage Patterns

#### 1. Read-Only Operations
```json
{
  "tools": [
    {"name": "read_file", "permissions": "read-only"},
    {"name": "list_directory", "permissions": "read-only"}
  ]
}
```

#### 2. Containerization
```bash
docker run --read-only \
  --security-opt=no-new-privileges \
  --cap-drop=ALL \
  --user=nobody \
  mcp-server
```

#### 3. Whitelisted Commands
```javascript
{
  "allowed_commands": [
    "git status",
    "npm list",
    "python --version"
  ],
  "blocked_patterns": [
    "rm -rf",
    "sudo",
    "curl | bash"
  ]
}
```

#### 4. Use Stdio Mode (Recommended)
```bash
# Safer - uses stdio pipes
npx @modelcontextprotocol/server-name

# Riskier - exposes network port
npx @modelcontextprotocol/server-name --port 3000
```

### Best Practices for MCP

1. **Default Deny Policy**: Block everything by default, explicitly allow needed operations
2. **Principle of Least Privilege**: Run with minimal necessary permissions
3. **Comprehensive Logging**: Audit all operations
4. **Use Trusted Servers**: Stick to official/verified MCP implementations
5. **Rate Limiting**: Prevent abuse through request limits
6. **Approval Workflows**: Require confirmation for sensitive operations

### Safe MCP Configuration Example
```json
{
  "mcp_servers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/safe/directory"],
      "permissions": {
        "read": true,
        "write": false,
        "execute": false
      }
    },
    "memory": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-memory"],
      "sandboxed": true
    }
  }
}
```

### Why Exposing Port 3000 (or Any Port) is Risky

#### 1. **Network Attack Surface**
When you expose a port like 3000:
```bash
# RISKY - Creates network listener
npx @modelcontextprotocol/server-name --port 3000
```
This opens port 3000 to network connections, meaning:
- Any process on your machine can connect
- If firewall is misconfigured, external attackers could connect
- Creates a persistent network service that can be discovered
- Enables port scanning and service enumeration

#### 2. **Localhost Still Has Risks**
Even binding to `127.0.0.1:3000` isn't completely safe:
- Other local processes can connect (including malware)
- Browser-based attacks via JavaScript `fetch()` or XHR
- Port scanning by local malicious software
- Shared systems allow other users to connect
- No built-in authentication on most MCP servers

#### 3. **Common Misconfiguration Dangers**
```bash
# VERY DANGEROUS - Binds to all interfaces
npx server --port 3000 --host 0.0.0.0

# Docker mistake - Exposes to internet!
docker run -p 3000:3000 mcp-server  # Exposed externally!
```

#### 4. **Missing Security Controls**
Network-exposed MCP servers typically lack:
- Authentication mechanisms
- Rate limiting
- Request validation
- Access controls
- Encryption (HTTP vs HTTPS)

#### 5. **Protocol Vulnerabilities**
HTTP/TCP protocols over network can suffer from:
- Man-in-the-middle attacks
- Request injection
- Buffer overflow exploits
- Protocol confusion attacks
- Session hijacking

#### 6. **Real-World Attack Scenarios**

**Scenario 1: Malware Exploitation**
```bash
# Malware discovers open port 3000
curl http://127.0.0.1:3000/execute -d '{"command": "rm -rf /"}'
```

**Scenario 2: Browser-Based Attack**
```javascript
// Malicious website exploits local MCP server
fetch('http://127.0.0.1:3000/api/files')
  .then(data => sendToAttacker(data))
```

**Scenario 3: Docker Misconfiguration**
```dockerfile
# DANGEROUS - Exposes to internet
EXPOSE 3000
# Running with -p 3000:3000 makes it public!
```

#### Why Stdio Mode is Safer

```bash
# SAFE - Uses stdio pipes, no network
npx @modelcontextprotocol/server-name
```

**Stdio advantages:**
- **No network exposure** - only parent process can communicate
- **Process isolation** - communication through pipes only  
- **Automatic cleanup** - dies when parent process exits
- **OS-level security** - leverages process permissions
- **No port scanning** - invisible to network tools
- **No remote access** - physically impossible to connect remotely

#### Network Security Best Practices (If Ports Are Required)

1. **Bind to Localhost Only**
```bash
npx server --port 3000 --host 127.0.0.1
```

2. **Use Unix Domain Sockets Instead**
```bash
# Better than TCP ports
npx server --socket /tmp/mcp.sock
chmod 600 /tmp/mcp.sock  # Restrict permissions
```

3. **Add Authentication Layer**
```javascript
{
  "auth": {
    "type": "bearer",
    "token": "secure-random-token"
  }
}
```

4. **Implement Rate Limiting**
```javascript
{
  "rate_limit": {
    "requests_per_minute": 60,
    "max_connections": 5
  }
}
```

5. **Use TLS/SSL for Encryption**
```bash
# Use HTTPS instead of HTTP
npx server --port 3000 --cert server.crt --key server.key
```

#### Architecture Comparison

**Network Mode (Risky):**
```
Claude Code → Network Stack → Port 3000 → MCP Server
     ↑                            ↑
  Attacker                   Port Scanner
```

**Stdio Mode (Safe):**
```
Claude Code ←→ Stdio Pipes ←→ MCP Server
           (Process Isolation)
```

#### Key Principle
**Avoid network protocols when local IPC (Inter-Process Communication) suffices.** Network exposure should only be used when absolutely necessary and with proper security controls.

## Key Takeaways

### Semtools
- Powerful combination of AI-powered document parsing and semantic search
- Requires proper API configuration but provides excellent text extraction
- Semantic search finds contextually relevant content beyond keyword matching
- Outputs are well-structured and preserve document formatting

### MCP Security
- Terminal access should be avoided or heavily restricted
- Multiple layers of security are essential
- Stdio mode is safer than network mode
- Always apply principle of least privilege
- Structured APIs are preferable to raw command execution

## Resources

- **LlamaParse API**: https://api.cloud.llamaindex.ai
- **Semtools**: Installed via `cargo install semtools`
- **MCP Documentation**: Model Context Protocol specifications
- **Security Best Practices**: Container isolation, permission controls, audit logging

---

*Document created: 2025-09-06*  
*Tools tested: semtools v1.2.1, Rust 1.89.0*