/**
 * 横スライダーコンポーネント
 */
const Slider = (() => {
    const SCROLL_AMOUNT = 260;

    /**
     * スライダー描画
     * @param {Object} Options
     * @param {Array} Options.Shops - 店舗データ配列
     * @param {HTMLElement} Options.Container - 描画先コンテナ
     * @param {Function} Options.OnCardClick - カードクリック時コールバック
     */
    function Render(Options) {
        const { Shops, Container, OnCardClick } = Options;

        if (!Shops || Shops.length === 0) {
            Container.innerHTML = "";
            return;
        }

        let CardsHtml = "";
        Shops.forEach((Shop) => {
            CardsHtml += ShopCard.CreateHtml(Shop);
        });

        Container.innerHTML =
            '<div class="Slider">' +
            '<button class="Slider__Arrow Slider__Arrow--Left" id="SliderLeft">' +
            '<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>' +
            "</button>" +
            '<div class="Slider__Track" id="SliderTrack">' + CardsHtml + "</div>" +
            '<button class="Slider__Arrow Slider__Arrow--Right" id="SliderRight">' +
            '<svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>' +
            "</button>" +
            "</div>";

        // スクロールボタン
        const Track = Container.querySelector("#SliderTrack");
        const LeftBtn = Container.querySelector("#SliderLeft");
        const RightBtn = Container.querySelector("#SliderRight");

        if (LeftBtn && Track) {
            LeftBtn.addEventListener("click", () => {
                Track.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
            });
        }

        if (RightBtn && Track) {
            RightBtn.addEventListener("click", () => {
                Track.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
            });
        }

        // カードクリック
        if (OnCardClick) {
            Container.querySelectorAll(".ShopCard").forEach((Card) => {
                Card.addEventListener("click", () => {
                    OnCardClick(Card.dataset.shopId);
                });
            });
        }
    }

    return {
        Render
    };
})();
