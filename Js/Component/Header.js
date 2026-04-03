/**
 * ヘッダーコンポーネント
 */
const Header = (() => {
    /**
     * SVGアイコン定義
     */
    const Icons = {
        Bookmark: '<svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>',
        Search: '<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
        Back: '<svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>'
    };

    /**
     * ヘッダーを描画
     * @param {Object} Options
     * @param {boolean} Options.ShowBack - 戻るボタン表示
     * @param {Function} Options.OnBookmarkClick - ブックマーク押下時
     * @param {Function} Options.OnSearchClick - 検索押下時
     * @param {Function} Options.OnBackClick - 戻る押下時
     */
    function Render(Options = {}) {
        const Text = LanguageService.GetText();
        const Container = document.getElementById("Header");
        if (!Container) return;

        let ActionsHtml = "";

        if (Options.ShowBack) {
            ActionsHtml += '<button class="Header__IconButton" id="BackButton" aria-label="Back">' + Icons.Back + "</button>";
        }

        ActionsHtml += '<div class="LangToggle">';
        ActionsHtml += "<span>JP</span>";
        ActionsHtml += '<div class="LangToggle__Switch' + (LanguageService.IsEnglish() ? " Active" : "") + '" id="LangSwitch"></div>';
        ActionsHtml += "<span>EN</span>";
        ActionsHtml += "</div>";

        if (!Options.ShowBack) {
            ActionsHtml += '<button class="Header__IconButton" id="BookmarkButton" aria-label="Bookmark">' + Icons.Bookmark + "</button>";
            ActionsHtml += '<button class="Header__IconButton" id="SearchButton" aria-label="Search">' + Icons.Search + "</button>";
        }

        Container.innerHTML =
            '<h1 class="Header__Title">' + Text.AppTitle + "</h1>" +
            '<div class="Header__Actions">' + ActionsHtml + "</div>";

        Container.className = "Header";

        // イベント登録
        const LangSwitch = document.getElementById("LangSwitch");
        if (LangSwitch) {
            LangSwitch.addEventListener("click", () => {
                LanguageService.ToggleLang();
            });
        }

        const BookmarkBtn = document.getElementById("BookmarkButton");
        if (BookmarkBtn && Options.OnBookmarkClick) {
            BookmarkBtn.addEventListener("click", Options.OnBookmarkClick);
        }

        const SearchBtn = document.getElementById("SearchButton");
        if (SearchBtn && Options.OnSearchClick) {
            SearchBtn.addEventListener("click", Options.OnSearchClick);
        }

        const BackBtn = document.getElementById("BackButton");
        if (BackBtn && Options.OnBackClick) {
            BackBtn.addEventListener("click", Options.OnBackClick);
        }
    }

    return {
        Render
    };
})();
