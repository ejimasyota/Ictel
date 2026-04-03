/**
 * 店舗詳細画面コントローラー
 */
const DetailController = (() => {
    let ShopData = null;

    /**
     * 初期化
     */
    async function Init() {
        // ヘッダー描画
        RenderHeader();

        // 言語変更時の再描画
        LanguageService.OnChange(() => {
            RenderHeader();
            if (ShopData) RenderDetail();
        });

        // URLパラメータからショップID取得
        const Params = new URLSearchParams(window.location.search);
        const ShopId = Params.get("id");

        if (!ShopId) {
            window.location.href = "index.html";
            return;
        }

        // 店舗データ取得
        await LoadShopDetail(ShopId);
    }

    /**
     * ヘッダー描画
     */
    function RenderHeader() {
        Header.Render({
            ShowBack: true,
            OnBackClick: () => {
                window.history.back();
            }
        });
    }

    /**
     * 店舗詳細データ取得
     */
    async function LoadShopDetail(ShopId) {
        SpinnerDialog.Show();

        try {
            const Result = await HotPepperApi.SearchShops({
                Keyword: ShopId,
                Count: 1,
                Start: 1
            });

            SpinnerDialog.Hide();

            if (Result.Shops.length > 0) {
                ShopData = Result.Shops[0];
                RenderDetail();
                LoadGoogleMap();
            } else {
                const Text = LanguageService.GetText();
                ErrorDialog.Show(Text.ErrorMessages.ApiError, () => {
                    window.location.href = "index.html";
                });
            }
        } catch (E) {
            SpinnerDialog.Hide();
            const Text = LanguageService.GetText();
            ErrorDialog.Show(Text.ErrorMessages.ApiError, () => {
                window.location.href = "index.html";
            });
        }
    }

    /**
     * 詳細情報描画
     */
    function RenderDetail() {
        if (!ShopData) return;

        const Text = LanguageService.GetText();
        const Container = document.getElementById("DetailContent");
        const IsBookmarked = BookmarkService.IsBookmarked(ShopData.Id);
        const BookmarkClass = IsBookmarked ? "DetailCard__BookmarkBtn--Active" : "DetailCard__BookmarkBtn--Inactive";

        const NoImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='280' fill='%23e2e8f0'%3E%3Crect width='400' height='280'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";
        const ImageSrc = ShopData.Photo || NoImage;

        let InfoItems = "";

        // 店舗種別
        if (ShopData.Genre) {
            InfoItems += CreateInfoItem(
                '<svg viewBox="0 0 24 24"><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>',
                Text.Genre,
                ShopCard.EscapeHtml(ShopData.Genre + (ShopData.SubGenre ? " / " + ShopData.SubGenre : ""))
            );
        }

        // 営業時間
        if (ShopData.Open) {
            InfoItems += CreateInfoItem(
                '<svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>',
                Text.OpeningHours,
                ShopCard.EscapeHtml(ShopData.Open)
            );
        }

        // 住所
        if (ShopData.Address) {
            InfoItems += CreateInfoItem(
                '<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
                Text.Address,
                ShopCard.EscapeHtml(ShopData.Address)
            );
        }

        // 電話番号
        if (ShopData.Phone) {
            InfoItems += CreateInfoItem(
                '<svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>',
                Text.Phone,
                ShopCard.EscapeHtml(ShopData.Phone)
            );
        }

        // アクセス
        if (ShopData.Access) {
            InfoItems += CreateInfoItem(
                '<svg viewBox="0 0 24 24"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>',
                "アクセス",
                ShopCard.EscapeHtml(ShopData.Access)
            );
        }

        // 予算
        if (ShopData.Budget) {
            InfoItems += CreateInfoItem(
                '<svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>',
                "予算",
                ShopCard.EscapeHtml(ShopData.Budget + (ShopData.BudgetAverage ? "（" + ShopData.BudgetAverage + "）" : ""))
            );
        }

        // 公式サイト
        let WebsiteHtml = "";
        if (ShopData.Url) {
            WebsiteHtml = CreateInfoItem(
                '<svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>',
                Text.Website,
                '<a href="' + ShopCard.EscapeHtml(ShopData.Url) + '" target="_blank" rel="noopener noreferrer">' + Text.Website + "</a>"
            );
        }

        // キャッチコピー
        const CatchHtml = ShopData.CatchCopy
            ? '<div class="DetailCard__CatchCopy">' + ShopCard.EscapeHtml(ShopData.CatchCopy) + "</div>"
            : "";

        Container.innerHTML =
            '<div class="DetailCard">' +
            '<img class="DetailCard__Image" src="' + ImageSrc + '" alt="' + ShopCard.EscapeHtml(ShopData.Name) + '" onerror="this.src=\'' + NoImage + '\'">' +
            '<div class="DetailCard__Body">' +
            '<div class="DetailCard__Header">' +
            '<h1 class="DetailCard__Name">' + ShopCard.EscapeHtml(ShopData.Name) + "</h1>" +
            '<button class="DetailCard__BookmarkBtn ' + BookmarkClass + '" id="BookmarkToggleBtn">' +
            '<svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>' +
            "</button></div>" +
            CatchHtml +
            '<div class="DetailCard__InfoList">' +
            InfoItems +
            WebsiteHtml +
            "</div>" +
            '<div class="DetailCard__Map" id="GoogleMapContainer"></div>' +
            "</div></div>";

        // ブックマークボタン
        const BookmarkBtn = document.getElementById("BookmarkToggleBtn");
        if (BookmarkBtn) {
            BookmarkBtn.addEventListener("click", ToggleBookmark);
        }

        // タイトル更新
        document.title = ShopData.Name + " - " + Text.AppTitle;
    }

    /**
     * 情報項目HTML生成
     */
    function CreateInfoItem(IconSvg, Label, Value) {
        return '<div class="DetailCard__InfoItem">' +
            '<div class="DetailCard__InfoIcon">' + IconSvg + "</div>" +
            "<div>" +
            '<div class="DetailCard__InfoLabel">' + Label + "</div>" +
            '<div class="DetailCard__InfoValue">' + Value + "</div>" +
            "</div></div>";
    }

    /**
     * ブックマークトグル
     */
    function ToggleBookmark() {
        if (!ShopData) return;

        const Text = LanguageService.GetText();
        const Btn = document.getElementById("BookmarkToggleBtn");

        if (BookmarkService.IsBookmarked(ShopData.Id)) {
            BookmarkService.Remove(ShopData.Id);
            Btn.className = "DetailCard__BookmarkBtn DetailCard__BookmarkBtn--Inactive";
            Toast.Show(Text.BookmarkRemove);
        } else {
            BookmarkService.Add(ShopData);
            Btn.className = "DetailCard__BookmarkBtn DetailCard__BookmarkBtn--Active";
            Toast.Show(Text.BookmarkAdd);
        }
    }

    /**
     * GoogleMap読み込み・表示
     */
    function LoadGoogleMap() {
        if (!ShopData || !ShopData.Lat || !ShopData.Lng) return;

        // Google Maps APIスクリプト読み込み
        window.InitGoogleMap = function () {
            const MapContainer = document.getElementById("GoogleMapContainer");
            if (!MapContainer) return;

            const Position = { lat: ShopData.Lat, lng: ShopData.Lng };

            const Map = new google.maps.Map(MapContainer, {
                center: Position,
                zoom: 16,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true
            });

            new google.maps.Marker({
                position: Position,
                map: Map,
                title: ShopData.Name
            });
        };

        const Script = document.getElementById("GoogleMapsScript");
        if (Script) {
            Script.src = "https://maps.googleapis.com/maps/api/js?key=" + GOOGLE_MAPS_API_KEY + "&callback=InitGoogleMap";
        }
    }

    // DOM読み込み完了後に初期化
    document.addEventListener("DOMContentLoaded", Init);

    return {
        Init
    };
})();
