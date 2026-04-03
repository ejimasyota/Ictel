/**
 * インフォダイアログ
 */
const InfoDialog = (() => {
    const DIALOG_ID = "InfoDialogOverlay";

    /**
     * 表示
     * @param {string} Message - メッセージ
     * @param {Function} OnClose - 閉じた時のコールバック
     */
    function Show(Message, OnClose) {
        const Text = LanguageService.GetText();

        const Html =
            '<div class="Dialog__Header">' +
            '<span class="Dialog__Title">' + Text.Info + "</span>" +
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
