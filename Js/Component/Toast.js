/**
 * トースト通知コンポーネント
 */
const Toast = (() => {
    let TimerId = null;

    /**
     * トースト表示
     * @param {string} Message - メッセージ
     * @param {number} Duration - 表示時間(ms)
     */
    function Show(Message, Duration = 2500) {
        // 既存トーストを削除
        const Existing = document.getElementById("ToastMessage");
        if (Existing) {
            Existing.remove();
            clearTimeout(TimerId);
        }

        const El = document.createElement("div");
        El.className = "Toast";
        El.id = "ToastMessage";
        El.textContent = Message;
        document.body.appendChild(El);

        requestAnimationFrame(() => {
            El.classList.add("Visible");
        });

        TimerId = setTimeout(() => {
            El.classList.remove("Visible");
            setTimeout(() => {
                if (El.parentNode) El.parentNode.removeChild(El);
            }, 300);
        }, Duration);
    }

    return {
        Show
    };
})();
