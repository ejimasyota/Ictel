/**
 * メイン画面コントローラー
 */
const MainController = (() => {
    let CurrentPage = 1;
    let CurrentConditions = null;
    let CurrentSearchResult = null;

    /**
     * 初期化
     */
    async function Init() {
        // ヘッダー描画
        RenderHeader();

        // 言語変更時の再描画
        LanguageService.OnChange(() => {
            RenderHeader();
            RenderPageContent();
        });

        // 初期メッセージ表示
        ShowInitialMessage();

        // マスターデータ読み込み（バックグラウンド）
        SearchDialog.LoadMasterData();

        // おすすめ店舗読み込み
        LoadRecommendShops();
    }

    /**
     * ヘッダー描画
     */
    function RenderHeader() {
        Header.Render({
            ShowBack: false,
            OnBookmarkClick: () => {
                BookmarkDialog.Show(NavigateToDetail);
            },
            OnSearchClick: () => {
                SearchDialog.Show(OnSearchExecute);
            }
        });
    }

    /**
     * 初期メッセージ表示
     */
    function ShowInitialMessage() {
        const Text = LanguageService.GetText();
        const El = document.getElementById("InitialMessage");
        if (El) {
            El.textContent = Text.SearchDialog.Title + "...";
            El.style.display = "block";
        }
    }

    /**
     * おすすめ店舗読み込み
     */
    async function LoadRecommendShops() {
        try {
            const Position = await GeolocationService.GetCurrentPosition();
            const Result = await HotPepperApi.SearchNearbyShops(Position.Lat, Position.Lng);

            if (Result.Shops.length > 0) {
                const Section = document.getElementById("RecommendSection");
                const TitleEl = document.getElementById("RecommendTitle");
                const SliderEl = document.getElementById("RecommendSlider");
                const Text = LanguageService.GetText();

                TitleEl.textContent = Text.Recommend;
                Section.style.display = "block";

                Slider.Render({
                    Shops: Result.Shops,
                    Container: SliderEl,
                    OnCardClick: NavigateToDetail
                });
            }
        } catch (E) {
            console.warn("おすすめ店舗の取得をスキップしました", E);
        }
    }

    /**
     * 検索実行コールバック
     */
    async function OnSearchExecute(Conditions) {
        CurrentConditions = Conditions;
        CurrentPage = 1;

        SpinnerDialog.Show();

        try {
            const Result = await HotPepperApi.SearchShops({
                Keyword: Conditions.Keyword,
                Genre: Conditions.Genre,
                Area: Conditions.Area,
                Start: 1,
                Count: SEARCH_RESULTS_PER_PAGE
            });

            SpinnerDialog.Hide();

            if (Result.TotalCount === 0) {
                const Text = LanguageService.GetText();
                ErrorDialog.Show(Text.ErrorMessages.NoSearchResults);
                return;
            }

            // 検索成功：ダイアログ閉じて結果表示
            SearchDialog.Close();
            CurrentSearchResult = Result;
            RenderSearchResults();

            // 初期メッセージ非表示
            const InitEl = document.getElementById("InitialMessage");
            if (InitEl) InitEl.style.display = "none";

        } catch (E) {
            SpinnerDialog.Hide();
            const Text = LanguageService.GetText();
            ErrorDialog.Show(Text.ErrorMessages.ApiError);
        }
    }

    /**
     * 検索結果描画
     */
    function RenderSearchResults() {
        if (!CurrentSearchResult) return;

        const Text = LanguageService.GetText();
        const Section = document.getElementById("ResultSection");
        const TitleEl = document.getElementById("ResultTitle");
        const GridEl = document.getElementById("ResultGrid");
        const PaginationEl = document.getElementById("PaginationContainer");

        TitleEl.textContent = Text.SearchResults + "（" + CurrentSearchResult.TotalCount + "件）";
        Section.style.display = "block";

        // カード描画
        let CardsHtml = "";
        CurrentSearchResult.Shops.forEach((Shop) => {
            CardsHtml += ShopCard.CreateHtml(Shop);
        });
        GridEl.innerHTML = CardsHtml;

        // カードクリック
        GridEl.querySelectorAll(".ShopCard").forEach((Card) => {
            Card.addEventListener("click", () => {
                NavigateToDetail(Card.dataset.shopId);
            });
        });

        // ページネーション
        Pagination.Render({
            CurrentPage: CurrentPage,
            TotalCount: CurrentSearchResult.TotalCount,
            PerPage: SEARCH_RESULTS_PER_PAGE,
            Container: PaginationEl,
            OnPageChange: OnPageChange
        });

        // スクロールトップ
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    /**
     * ページ変更
     */
    async function OnPageChange(Page) {
        CurrentPage = Page;
        SpinnerDialog.Show();

        try {
            const Start = (Page - 1) * SEARCH_RESULTS_PER_PAGE + 1;
            const Result = await HotPepperApi.SearchShops({
                Keyword: CurrentConditions.Keyword,
                Genre: CurrentConditions.Genre,
                Area: CurrentConditions.Area,
                Start: Start,
                Count: SEARCH_RESULTS_PER_PAGE
            });

            SpinnerDialog.Hide();
            CurrentSearchResult = Result;
            RenderSearchResults();

        } catch (E) {
            SpinnerDialog.Hide();
            const Text = LanguageService.GetText();
            ErrorDialog.Show(Text.ErrorMessages.ApiError);
        }
    }

    /**
     * 言語変更時のページ再描画
     */
    function RenderPageContent() {
        const Text = LanguageService.GetText();

        // タイトル更新
        document.title = Text.AppTitle;

        // おすすめセクション
        const RecommendTitle = document.getElementById("RecommendTitle");
        if (RecommendTitle) {
            RecommendTitle.textContent = Text.Recommend;
        }

        // 検索結果セクション
        if (CurrentSearchResult) {
            RenderSearchResults();
        } else {
            ShowInitialMessage();
        }
    }

    /**
     * 店舗詳細画面へ遷移
     */
    function NavigateToDetail(ShopId) {
        window.location.href = "Detail.html?id=" + encodeURIComponent(ShopId);
    }

    // DOM読み込み完了後に初期化
    document.addEventListener("DOMContentLoaded", Init);

    return {
        Init
    };
})();
