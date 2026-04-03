/**
 * 国土交通DPF API - 鹿児島県の市区町村取得
 */
const CityApi = (() => {
    /**
     * 鹿児島県の市区町村一覧（フォールバック用）
     */
    const FALLBACK_CITIES = [
        { Code: "46201", Name: "鹿児島市" },
        { Code: "46203", Name: "鹿屋市" },
        { Code: "46204", Name: "枕崎市" },
        { Code: "46206", Name: "阿久根市" },
        { Code: "46208", Name: "出水市" },
        { Code: "46210", Name: "指宿市" },
        { Code: "46213", Name: "西之表市" },
        { Code: "46214", Name: "垂水市" },
        { Code: "46215", Name: "薩摩川内市" },
        { Code: "46216", Name: "日置市" },
        { Code: "46217", Name: "曽於市" },
        { Code: "46218", Name: "霧島市" },
        { Code: "46219", Name: "いちき串木野市" },
        { Code: "46220", Name: "南さつま市" },
        { Code: "46221", Name: "志布志市" },
        { Code: "46222", Name: "奄美市" },
        { Code: "46223", Name: "南九州市" },
        { Code: "46224", Name: "伊佐市" },
        { Code: "46225", Name: "姶良市" }
    ];

    /**
     * 鹿児島県の市区町村一覧を取得
     */
    async function FetchCities() {
        try {
            const Url = "/api/mlit?" + new URLSearchParams({
                area: KAGOSHIMA_PREF_CODE,
                apikey: MLIT_API_KEY
            }).toString();

            const Response = await fetch(Url);

            if (!Response.ok) {
                throw new Error("API response: " + Response.status);
            }

            const Data = await Response.json();

            if (Data.data && Array.isArray(Data.data)) {
                const Cities = Data.data
                    .filter((Item) => Item.name && Item.code)
                    .map((Item) => ({
                        Code: String(Item.code),
                        Name: Item.name
                    }));

                if (Cities.length > 0) {
                    return Cities;
                }
            }

            return FALLBACK_CITIES;
        } catch (Error) {
            console.warn("国土交通DPF APIの呼び出しに失敗しました。フォールバックデータを使用します。", Error);
            return FALLBACK_CITIES;
        }
    }

    return {
        FetchCities
    };
})();
