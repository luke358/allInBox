
module.exports = (AllInBox, settings) => {
  console.log(AllInBox, settings)
  const getMessages = () => {
    let directCount = 0;
    const directCountPerServer = document.querySelectorAll(
      '[class*="lowerBadge_"] [class*="numberBadge_"]',
    );

    for (const directCountBadge of directCountPerServer) {
      directCount += AllInBox.safeParseInt(directCountBadge.textContent);
    }

    const indirectCountPerServer =
      document.title.search('• Discord') === -1 ? 0 : 1;

    AllInBox.setBadge(directCount, indirectCountPerServer);
  };

  AllInBox.loop(getMessages);

  function addTranslateButtonToMessage(messageElement) {
    if (!messageElement.querySelector('.all-in-box__translate-button')) {
      const btn = document.createElement('button');
      btn.innerText = '翻译';
      btn.classList.add('.all-in-box__translate-button');
      btn.addEventListener('click', function () {
        // 此处调用翻译功能
        alert('此功能尚未实现！');
      });
      messageElement.appendChild(btn);
    }
  }
  // 给页面上现有的所有消息添加翻译按钮
  function addTranslateButtonsToExistingMessages() {
    const messages = Array.from(document.querySelectorAll('[id^="message-content"]'))
      .filter(el => !Array.from(el.classList).some(cls => cls.startsWith('repliedTextContent')));
    console.log(messages, 'mmmmeeeeee');
    messages.forEach(addTranslateButtonToMessage);
  }

  // 设置MutationObserver来监听新添加的消息
  function observeNewMessages() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          // 检查是否为我们要找的类型的消息元素
          if (node.nodeType === Node.ELEMENT_NODE && node.matches('[id^="chat-messages"]')) {
            // addTranslateButtonToMessage(node);
            console.log(node)
            node.querySelectorAll('[id^="message-content"]').forEach(addTranslateButtonToMessage);
          }
        });
      });
    });

    // 设置观察器
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  window.addEventListener('load', function () {
    addTranslateButtonsToExistingMessages();
    observeNewMessages();
  });
}
