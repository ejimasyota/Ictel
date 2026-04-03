/**
 * ページネーションコンポーネント
 */
const Pagination = (() => {
    /**
     * ページネーション描画
     * @param {Object} Options
     * @param {number} Options.CurrentPage - 現在のページ
     * @param {number} Options.TotalCount - 全件数
     * @param {number} Options.PerPage - 1ページの件数
     * @param {Function} Options.OnPageChange - ページ変更コールバック
     * @param {HTMLElement} Options.Container - 描画先コンテナ
     */
    function Render(Options) {
        const { CurrentPage, TotalCount, PerPage, OnPageChange, Container } = Options;
        const TotalPages = Math.ceil(TotalCount / PerPage);

        if (TotalPages <= 1) {
            Container.innerHTML = "";
            return;
        }

        const Text = LanguageService.GetText();
        let Html = '<div class="Pagination">';

        // 前へ
        Html += '<button class="Pagination__Button"' +
            (CurrentPage <= 1 ? " disabled" : "") +
            ' data-page="' + (CurrentPage - 1) + '">' +
            Text.Pagination.Prev + "</button>";

        // ページ番号
        const Pages = CalculatePageRange(CurrentPage, TotalPages);
        Pages.forEach((Page) => {
            if (Page === "...") {
                Html += '<span class="Pagination__Button" style="border:none;cursor:default;">...</span>';
            } else {
                Html += '<button class="Pagination__Button' +
                    (Page === CurrentPage ? " Pagination__Button--Active" : "") +
                    '" data-page="' + Page + '">' + Page + "</button>";
            }
        });

        // 次へ
        Html += '<button class="Pagination__Button"' +
            (CurrentPage >= TotalPages ? " disabled" : "") +
            ' data-page="' + (CurrentPage + 1) + '">' +
            Text.Pagination.Next + "</button>";

        Html += "</div>";
        Container.innerHTML = Html;

        // イベント
        Container.querySelectorAll(".Pagination__Button[data-page]").forEach((Btn) => {
            Btn.addEventListener("click", () => {
                if (Btn.disabled) return;
                const Page = parseInt(Btn.dataset.page, 10);
                if (Page >= 1 && Page <= TotalPages) {
                    OnPageChange(Page);
                }
            });
        });
    }

    /**
     * 表示するページ番号の範囲を計算
     */
    function CalculatePageRange(Current, Total) {
        if (Total <= 7) {
            return Array.from({ length: Total }, (_, I) => I + 1);
        }

        const Pages = [];
        Pages.push(1);

        if (Current > 3) {
            Pages.push("...");
        }

        const Start = Math.max(2, Current - 1);
        const End = Math.min(Total - 1, Current + 1);

        for (let I = Start; I <= End; I++) {
            Pages.push(I);
        }

        if (Current < Total - 2) {
            Pages.push("...");
        }

        Pages.push(Total);
        return Pages;
    }

    return {
        Render
    };
})();
