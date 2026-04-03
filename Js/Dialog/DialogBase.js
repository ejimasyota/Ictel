/**
 * ダイアログ基底ユーティリティ
 */
const DialogBase = (() => {
    /**
     * ダイアログオーバーレイを生成・表示
     * @param {string} ContentHtml - ダイアログ内部HTML
     * @param {Object} Options
     * @param {string} Options.Id - オーバーレイID
     * @param {boolean} Options.CloseOnOverlay - オーバーレイクリックで閉じるか
     * @returns {HTMLElement} オーバーレイ要素
     */
    function Show(ContentHtml, Options = {}) {
        const Id = Options.Id || "DialogOverlay_" + Date.now();

        // 既存があれば削除
        const Existing = document.getElementById(Id);
        if (Existing) Existing.remove();

        const Overlay = document.createElement("div");
        Overlay.className = "DialogOverlay";
        Overlay.id = Id;
        Overlay.innerHTML = '<div class="Dialog">' + ContentHtml + "</div>";

        document.body.appendChild(Overlay);

        // アニメーション開始
        requestAnimationFrame(() => {
            Overlay.classList.add("Visible");
        });

        // オーバーレイクリックで閉じる
        if (Options.CloseOnOverlay !== false) {
            Overlay.addEventListener("click", (E) => {
                if (E.target === Overlay) {
                    Close(Id);
                }
            });
        }

        return Overlay;
    }

    /**
     * ダイアログを閉じる
     */
    function Close(Id) {
        const Overlay = document.getElementById(Id);
        if (!Overlay) return;

        Overlay.classList.remove("Visible");
        setTimeout(() => {
            if (Overlay.parentNode) {
                Overlay.parentNode.removeChild(Overlay);
            }
        }, 300);
    }

    /**
     * 閉じるボタンHTML
     */
    function CloseButtonHtml() {
        return '<button class="Dialog__CloseButton" data-dialog-close>' +
            '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>' +
            "</button>";
    }

    /**
     * ダイアログ内の閉じるボタンにイベントを登録
     */
    function BindCloseButtons(Overlay, Id) {
        Overlay.querySelectorAll("[data-dialog-close]").forEach((Btn) => {
            Btn.addEventListener("click", () => Close(Id));
        });
    }

    return {
        Show,
        Close,
        CloseButtonHtml,
        BindCloseButtons
    };
})();
