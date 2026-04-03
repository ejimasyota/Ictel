/**
 * 店舗カードコンポーネント
 */
const ShopCard = (() => {
    const NO_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' fill='%23e2e8f0'%3E%3Crect width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";

    /**
     * 店舗カードHTML生成
     */
    function CreateHtml(Shop) {
        const Text = LanguageService.GetText();
        const ImageSrc = Shop.Photo || Shop.PhotoSmall || NO_IMAGE;
        const StatusClass = "ShopCard__Status--Open";
        const StatusText = Text.Open;

        let RatingHtml = "";
        if (Shop.Rating) {
            RatingHtml = '<div class="ShopCard__Rating">' + CreateStarHtml(Shop.Rating) + " " + Shop.Rating + "</div>";
        }

        return '<div class="ShopCard" data-shop-id="' + Shop.Id + '">' +
            '<img class="ShopCard__Image" src="' + ImageSrc + '" alt="' + EscapeHtml(Shop.Name) + '" loading="lazy" onerror="this.src=\'' + NO_IMAGE + '\'">' +
            '<div class="ShopCard__Body">' +
            '<div class="ShopCard__Name">' + EscapeHtml(Shop.Name) + "</div>" +
            '<div class="ShopCard__Genre">' + EscapeHtml(Shop.Genre) + "</div>" +
            (Shop.Open ? '<div class="ShopCard__Hours">' + EscapeHtml(Shop.Open) + "</div>" : "") +
            RatingHtml +
            "</div></div>";
    }

    /**
     * 星評価HTML
     */
    function CreateStarHtml(Rating) {
        const Full = Math.floor(Rating);
        const Half = Rating - Full >= 0.5 ? 1 : 0;
        const Empty = 5 - Full - Half;
        let Html = "";
        for (let I = 0; I < Full; I++) Html += "&#9733;";
        for (let I = 0; I < Half; I++) Html += "&#9734;";
        for (let I = 0; I < Empty; I++) Html += "&#9734;";
        return Html;
    }

    /**
     * HTMLエスケープ
     */
    function EscapeHtml(Str) {
        if (!Str) return "";
        const Div = document.createElement("div");
        Div.textContent = Str;
        return Div.innerHTML;
    }

    return {
        CreateHtml,
        EscapeHtml
    };
})();
