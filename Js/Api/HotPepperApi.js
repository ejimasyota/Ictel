/**
 * ホットペッパーグルメAPI
 * サーバープロキシ経由
 */
const HotPepperApi = (() => {

    /**
     * パラメータをURLクエリ文字列に変換
     */
    function BuildQuery(Params) {
        return Object.entries(Params)
            .filter(([, Value]) => Value !== "" && Value !== null && Value !== undefined)
            .map(([Key, Value]) => encodeURIComponent(Key) + "=" + encodeURIComponent(Value))
            .join("&");
    }

    /**
     * 店舗検索
     * @param {Object} Conditions - 検索条件
     * @param {string} Conditions.Keyword - キーワード
     * @param {string} Conditions.Genre - ジャンルコード
     * @param {string} Conditions.Area - エリア名（市区町村名）
     * @param {number} Conditions.Start - 取得開始位置
     * @param {number} Conditions.Count - 取得件数
     * @param {number} Conditions.Lat - 緯度
     * @param {number} Conditions.Lng - 経度
     * @param {number} Conditions.Range - 検索範囲（1-5）
     */
    async function SearchShops(Conditions = {}) {
        const Params = {
            key: HOTPEPPER_API_KEY,
            large_area: HOTPEPPER_LARGE_AREA,
            count: Conditions.Count || SEARCH_RESULTS_PER_PAGE,
            start: Conditions.Start || 1
        };

        if (Conditions.Keyword) {
            Params.keyword = Conditions.Keyword;
        }
        if (Conditions.Genre) {
            Params.genre = Conditions.Genre;
        }
        if (Conditions.Area) {
            Params.keyword = Params.keyword
                ? Params.keyword + " " + Conditions.Area
                : Conditions.Area;
        }
        if (Conditions.Lat && Conditions.Lng) {
            Params.lat = Conditions.Lat;
            Params.lng = Conditions.Lng;
            Params.range = Conditions.Range || 5;
            delete Params.large_area;
        }

        const Query = BuildQuery(Params);
        const Response = await fetch("/api/hotpepper/gourmet?" + Query);
        const Data = await Response.json();

        if (Data.results && Data.results.shop) {
            return {
                TotalCount: parseInt(Data.results.results_available, 10),
                DisplayCount: parseInt(Data.results.results_returned, 10),
                Start: parseInt(Data.results.results_start, 10),
                Shops: Data.results.shop.map(FormatShopData)
            };
        }

        return { TotalCount: 0, DisplayCount: 0, Start: 1, Shops: [] };
    }

    /**
     * 現在地周辺の店舗取得（おすすめ用）
     */
    async function SearchNearbyShops(Lat, Lng, Count = RECOMMEND_DISPLAY_COUNT) {
        return SearchShops({
            Lat: Lat,
            Lng: Lng,
            Range: 5,
            Count: Count,
            Start: 1
        });
    }

    /**
     * 店舗データの整形
     */
    function FormatShopData(Raw) {
        return {
            Id: Raw.id || "",
            Name: Raw.name || "",
            NameKana: Raw.name_kana || "",
            Genre: Raw.genre ? Raw.genre.name : "",
            GenreCode: Raw.genre ? Raw.genre.code : "",
            SubGenre: Raw.sub_genre ? Raw.sub_genre.name : "",
            Address: Raw.address || "",
            Lat: parseFloat(Raw.lat) || 0,
            Lng: parseFloat(Raw.lng) || 0,
            Open: Raw.open || "",
            Close: Raw.close || "",
            Phone: Raw.tel || "",
            Photo: Raw.photo ? Raw.photo.pc ? Raw.photo.pc.l : "" : "",
            PhotoSmall: Raw.photo ? Raw.photo.pc ? Raw.photo.pc.m : "" : "",
            Thumbnail: Raw.photo ? Raw.photo.mobile ? Raw.photo.mobile.s : "" : "",
            Budget: Raw.budget ? Raw.budget.name : "",
            BudgetAverage: Raw.budget ? Raw.budget.average : "",
            Access: Raw.access || "",
            Url: Raw.urls ? Raw.urls.pc : "",
            CatchCopy: Raw.catch || "",
            Capacity: Raw.capacity || "",
            WiFi: Raw.wifi || "",
            Card: Raw.card || "",
            Lunch: Raw.lunch || "",
            Midnight: Raw.midnight || ""
        };
    }

    /**
     * ジャンル一覧取得
     */
    async function FetchGenres() {
        const Params = {
            key: HOTPEPPER_API_KEY
        };
        const Query = BuildQuery(Params);
        const Response = await fetch("/api/hotpepper/genre?" + Query);
        const Data = await Response.json();

        if (Data.results && Data.results.genre) {
            return Data.results.genre.map((Item) => ({
                Code: Item.code,
                Name: Item.name
            }));
        }

        return [];
    }

    return {
        SearchShops,
        SearchNearbyShops,
        FetchGenres
    };
})();
