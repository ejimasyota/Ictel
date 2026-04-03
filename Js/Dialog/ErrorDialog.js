/**
 * エラーダイアログ
 */
const ErrorDialog = (() => {
    const DIALOG_ID = "ErrorDialogOverlay";

    /**
     * 表示
     * @param {string} Message - エラーメッセージ
     * @param {Function} OnClose - 閉じた時のコールバック
     */
    function Show(Message, OnClose) {
        const Text = LanguageService.GetText();

        const Html =
            '<div class="Dialog__Header">' +
            '<span class="Dialog__Title" style="color:var(--color-error)">' + Text.Error + "</span>" +
            DialogBase.CloseButtonHtml() +
            "</div>" +
            '<div class="Dialog__Body">' +
            "<p>" + ShopCard.EscapeHtml(Message) + "</p>" +
            "</div>" +
            '<div class="Dialog__Footer">' +
            '<button class="Button Button--Primary" data-dialog-close>' + Text.Ok + "</button>" +
            "</div>";

        const Overlay = DialogBase.Show(Html, { Id: DIALOG_ID });
        DialogBase.BindCloseButtons(Overlay, DIALOG_ID);

        if (OnClose) {
            const Observer = new MutationObserver(() => {
                if (!document.getElementById(DIALOG_ID)) {
                    Observer.disconnect();
                    OnClose();
                }
            });
            Observer.observe(document.body, { childList: true });
        }
    }

    return {
        Show
    };
})();
