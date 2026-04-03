/**
 * ブックマーク一覧ダイアログ
 */
const BookmarkDialog = (() => {
    const DIALOG_ID = "BookmarkDialogOverlay";
    let OnNavigateCallback = null;

    /**
     * 表示
     * @param {Function} OnNavigate - 店舗詳細遷移コールバック(ShopId)
     */
    function Show(OnNavigate) {
        OnNavigateCallback = OnNavigate;
        RenderContent();
    }

    /**
     * コンテンツ描画
     */
    function RenderContent() {
        const Text = LanguageService.GetText();
        const Bookmarks = BookmarkService.GetAll();

        let BodyHtml = "";

        if (Bookmarks.length === 0) {
            BodyHtml = '<div class="NoData">' + Text.BookmarkEmpty + "</div>";
        } else {
            BodyHtml += '<div style="display:flex;flex-direction:column;gap:10px;">';
            Bookmarks.forEach((Shop) => {
                const ImageSrc = Shop.PhotoSmall || Shop.Photo || "";
                BodyHtml +=
                    '<div class="BookmarkCard">' +
                    (ImageSrc ? '<img class="BookmarkCard__Image" src="' + ImageSrc + '" alt="" loading="lazy">' : "") +
                    '<div class="BookmarkCard__Info" data-shop-id="' + ShopCard.EscapeHtml(Shop.Id) + '">' +
                    '<div class="BookmarkCard__Name">' + ShopCard.EscapeHtml(Shop.Name) + "</div>" +
                    '<div class="BookmarkCard__Genre">' + ShopCard.EscapeHtml(Shop.Genre) + "</div>" +
                    "</div>" +
                    '<button class="BookmarkDeleteIcon" data-delete-id="' + ShopCard.EscapeHtml(Shop.Id) + '">' +
                    '<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>' +
                    "</button></div>";
            });
            BodyHtml += "</div>";
        }

        const FooterHtml = Bookmarks.length > 0
            ? '<div class="Dialog__Footer">' +
              '<button class="Button Button--Danger" id="BookmarkClearAllBtn">' + Text.BookmarkClearAll + "</button>" +
              "</div>"
            : "";

        const Html =
            '<div class="Dialog__Header">' +
            '<span class="Dialog__Title">' + Text.BookmarkList + "</span>" +
            DialogBase.CloseButtonHtml() +
            "</div>" +
            '<div class="Dialog__Body">' + BodyHtml + "</div>" +
            FooterHtml;

        // 既存ダイアログを閉じてから再生成
        const Existing = document.getElementById(DIALOG_ID);
        if (Existing) Existing.remove();

        const Overlay = DialogBase.Show(Html, { Id: DIALOG_ID });
        DialogBase.BindCloseButtons(Overlay, DIALOG_ID);

        // 全削除ボタン
        const ClearBtn = document.getElementById("BookmarkClearAllBtn");
        if (ClearBtn) {
            ClearBtn.addEventListener("click", () => {
                const ConfirmText = LanguageService.GetText();
                ConfirmDialog.Show(ConfirmText.BookmarkClearConfirm, () => {
                    BookmarkService.ClearAll();
                    RenderContent();
                });
            });
        }

        // 個別削除ボタン
        Overlay.querySelectorAll("[data-delete-id]").forEach((Btn) => {
            Btn.addEventListener("click", (E) => {
                E.stopPropagation();
                const ShopId = Btn.dataset.deleteId;
                const ConfirmText = LanguageService.GetText();
                ConfirmDialog.Show(ConfirmText.BookmarkRemoveConfirm, () => {
                    BookmarkService.Remove(ShopId);
                    RenderContent();
                });
            });
        });

        // 店舗詳細遷移
        Overlay.querySelectorAll("[data-shop-id]").forEach((Info) => {
            Info.addEventListener("click", () => {
                const ShopId = Info.dataset.shopId;
                DialogBase.Close(DIALOG_ID);
                if (OnNavigateCallback) {
                    OnNavigateCallback(ShopId);
                }
            });
        });
    }

    return {
        Show
    };
})();
