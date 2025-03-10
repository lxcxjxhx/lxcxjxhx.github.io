document.addEventListener('DOMContentLoaded', function() {
    console.log('JavaScript 已加载');
    
    var aiButton = document.getElementById('ai-button');
    var floatContainer = document.getElementById('ai-float-container');
    var closeButton = document.getElementById('close-ai');
  
    if (!aiButton) console.error('未找到 ai-button');
    if (!floatContainer) console.error('未找到 ai-float-container');
    if (!closeButton) console.error('未找到 close-ai');
  
    aiButton.addEventListener('click', function() {
      console.log('点击 AI 助手按钮');
      floatContainer.style.display = 'block';
    });
  
    closeButton.addEventListener('click', function() {
      console.log('点击关闭按钮');
      floatContainer.style.display = 'none';
    });
  });