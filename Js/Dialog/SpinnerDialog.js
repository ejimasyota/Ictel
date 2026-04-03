/**
 * スピナーダイアログ
 */
const SpinnerDialog = (() => {
    const DIALOG_ID = "SpinnerDialogOverlay";

    /**
     * スピナー表示
     * @param {string} Message - 表示メッセージ
     */
    function Show(Message) {
        const Text = LanguageService.GetText();
        const DisplayMessage = Message || Text.Loading;

        const Html =
            '<div class="Dialog__Body">' +
            '<div class="Spinner">' +
            '<div class="Spinner__Circle"></div>' +
            '<div class="Spinner__Text">' + ShopCard.EscapeHtml(DisplayMessage) + "</div>" +
            "</div></div>";

        DialogBase.Show(Html, {
            Id: DIALOG_ID,
            CloseOnOverlay: false
        });
    }

    /**
     * スピナー非表示
     */
    function Hide() {
        DialogBase.Close(DIALOG_ID);
    }

    return {
        Show,
        Hide
    };
})();
