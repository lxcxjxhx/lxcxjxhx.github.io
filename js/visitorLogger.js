document.addEventListener("DOMContentLoaded", function () {
    function logVisitors() {
        let visitorsElement = document.querySelector("#busuanzi_value_site_uv");
        if (visitorsElement) {
            let visitorsCount = visitorsElement.innerText;
            let logData = {
                timestamp: new Date().toISOString(),
                visitors: visitorsCount
            };

            fetch("/api/logVisitors", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(logData)
            }).catch(err => console.error("Failed to log visitors:", err));
        }
    }
    
    setTimeout(logVisitors, 5000); // 等待 5 秒，确保 busuanzi 数据加载完毕
});
