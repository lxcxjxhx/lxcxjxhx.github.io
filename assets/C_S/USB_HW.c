#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <signal.h>
#include <sys/types.h>
#include <dirent.h>

#define LOG_FILE "security_log.txt"

// 可疑进程列表
const char *blocked_processes[] = {
    "malware",
    "keylogger",
    "taskmgr",
    NULL
};

// 记录日志
void log_event(const char *message) {
    FILE *log = fopen(LOG_FILE, "a");
    if (log) {
        fprintf(log, "[%ld] %s\n", time(NULL), message);
        fclose(log);
    }
}

// 终止可疑进程
void kill_suspicious_processes() {
    DIR *proc_dir = opendir("/proc");
    struct dirent *entry;
    
    if (!proc_dir) {
        log_event("无法打开 /proc 目录");
        return;
    }

    while ((entry = readdir(proc_dir)) != NULL) {
        if (entry->d_type == DT_DIR) {
            char cmd_path[256], cmd_line[256];
            FILE *cmd_file;

            snprintf(cmd_path, sizeof(cmd_path), "/proc/%s/cmdline", entry->d_name);
            cmd_file = fopen(cmd_path, "r");
            if (cmd_file) {
                if (fgets(cmd_line, sizeof(cmd_line), cmd_file)) {
                    for (int i = 0; blocked_processes[i] != NULL; i++) {
                        if (strstr(cmd_line, blocked_processes[i])) {
                            int pid = atoi(entry->d_name);
                            kill(pid, SIGKILL);
                            char log_msg[256];
                            snprintf(log_msg, sizeof(log_msg), "检测到并终止恶意进程: %s (PID: %d)", cmd_line, pid);
                            log_event(log_msg);
                            printf("%s\n", log_msg);
                        }
                    }
                }
                fclose(cmd_file);
            }
        }
    }
    closedir(proc_dir);
}

// 监控 USB 设备（仅 Linux，使用 udevadm）
void monitor_usb() {
    FILE *udev_pipe = popen("udevadm monitor --subsystem-match=usb", "r");
    if (!udev_pipe) {
        log_event("无法启动 udev 监视");
        return;
    }

    char buffer[256];
    while (fgets(buffer, sizeof(buffer), udev_pipe)) {
        log_event("USB 设备变更检测！");
        printf("USB 设备变更检测！\n");
    }

    pclose(udev_pipe);
}

int main() {
    printf("硬件防御系统启动...\n");
    log_event("硬件防御系统启动");

    // 后台运行 USB 监控
    if (fork() == 0) {
        monitor_usb();
        exit(0);
    }

    // 进程监控循环
    while (1) {
        kill_suspicious_processes();
        sleep(5);
    }

    return 0;
}
