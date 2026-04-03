/**
 * コンファームダイアログ
 */
const ConfirmDialog = (() => {
    const DIALOG_ID = "ConfirmDialogOverlay";

    /**
     * 表示
     * @param {string} Message - 確認メッセージ
     * @param {Function} OnConfirm - 「はい」押下時
     * @param {Function} OnCancel - 「いいえ」押下時
     */
    function Show(Message, OnConfirm, OnCancel) {
        const Text = LanguageService.GetText();

        const Html =
            '<div class="Dialog__Header">' +
            '<span class="Dialog__Title">' + Text.Confirm + "</span>" +
            DialogBase.CloseButtonHtml() +
            "</div>" +
            '<div class="Dialog__Body">' +
            "<p>" + ShopCard.EscapeHtml(Message) + "</p>" +
            "</div>" +
            '<div class="Dialog__Footer">' +
            '<button class="Button Button--Secondary" id="ConfirmCancelBtn">' + Text.No + "</button>" +
            '<button class="Button Button--Primary" id="ConfirmOkBtn">' + Text.Yes + "</button>" +
            "</div>";

        const Overlay = DialogBase.Show(Html, { Id: DIALOG_ID, CloseOnOverlay: false });
        DialogBase.BindCloseButtons(Overlay, DIALOG_ID);

        const OkBtn = document.getElementById("ConfirmOkBtn");
        const CancelBtn = document.getElementById("ConfirmCancelBtn");

        if (OkBtn) {
            OkBtn.addEventListener("click", () => {
                DialogBase.Close(DIALOG_ID);
                if (OnConfirm) OnConfirm();
            });
        }

        if (CancelBtn) {
            CancelBtn.addEventListener("click", () => {
                DialogBase.Close(DIALOG_ID);
                if (OnCancel) OnCancel();
            });
        }
    }

    return {
        Show
    };
})();
