/**
 * 検索ダイアログ
 */
const SearchDialog = (() => {
    const DIALOG_ID = "SearchDialogOverlay";
    let CityList = [];
    let GenreList = [];
    let OnSearchCallback = null;

    /**
     * 初期データ読み込み
     */
    async function LoadMasterData() {
        try {
            const [Cities, Genres] = await Promise.all([
                CityApi.FetchCities(),
                HotPepperApi.FetchGenres()
            ]);
            CityList = Cities;
            GenreList = Genres;
        } catch (E) {
            console.warn("マスターデータの取得に失敗しました", E);
        }
    }

    /**
     * 表示
     * @param {Function} OnSearch - 検索実行コールバック(Conditions)
     */
    function Show(OnSearch) {
        OnSearchCallback = OnSearch;
        const Text = LanguageService.GetText();

        // 市区町村プルダウンoptions
        let CityOptions = '<option value="">' + Text.SearchDialog.CityPlaceholder + "</option>";
        CityList.forEach((City) => {
            CityOptions += '<option value="' + ShopCard.EscapeHtml(City.Name) + '">' + ShopCard.EscapeHtml(City.Name) + "</option>";
        });

        // ジャンルプルダウンoptions
        let GenreOptions = '<option value="">' + Text.SearchDialog.GenrePlaceholder + "</option>";
        GenreList.forEach((Genre) => {
            GenreOptions += '<option value="' + ShopCard.EscapeHtml(Genre.Code) + '">' + ShopCard.EscapeHtml(Genre.Name) + "</option>";
        });

        const Html =
            '<div class="Dialog__Header">' +
            '<span class="Dialog__Title">' + Text.SearchDialog.Title + "</span>" +
            DialogBase.CloseButtonHtml() +
            "</div>" +
            '<div class="Dialog__Body">' +
            '<div class="FormGroup">' +
            '<label class="FormGroup__Label">' + Text.SearchDialog.City + "</label>" +
            '<select class="FormGroup__Select" id="SearchCity">' + CityOptions + "</select>" +
            "</div>" +
            '<div class="FormGroup">' +
            '<label class="FormGroup__Label">' + Text.SearchDialog.ShopName + "</label>" +
            '<input class="FormGroup__Input" id="SearchShopName" type="text" maxlength="30" placeholder="' + Text.SearchDialog.ShopNamePlaceholder + '">' +
            "</div>" +
            '<div class="FormGroup">' +
            '<label class="FormGroup__Label">' + Text.SearchDialog.Genre + "</label>" +
            '<select class="FormGroup__Select" id="SearchGenre">' + GenreOptions + "</select>" +
            "</div>" +
            '<div class="FormGroup">' +
            '<label class="FormGroup__Label">' + Text.SearchDialog.BusinessStatus + "</label>" +
            '<div class="FormGroup__Radio">' +
            '<label class="FormGroup__RadioLabel"><input type="radio" name="BusinessStatus" value="" checked> ' + Text.SearchDialog.StatusAll + "</label>" +
            '<label class="FormGroup__RadioLabel"><input type="radio" name="BusinessStatus" value="open"> ' + Text.SearchDialog.StatusOpen + "</label>" +
            '<label class="FormGroup__RadioLabel"><input type="radio" name="BusinessStatus" value="closed"> ' + Text.SearchDialog.StatusClosed + "</label>" +
            "</div></div>" +
            "</div>" +
            '<div class="Dialog__Footer">' +
            '<button class="Button Button--Primary" id="SearchExecuteBtn" style="width:100%">' + Text.SearchDialog.SearchButton + "</button>" +
            "</div>";

        const Overlay = DialogBase.Show(Html, { Id: DIALOG_ID });
        DialogBase.BindCloseButtons(Overlay, DIALOG_ID);

        const ExecuteBtn = document.getElementById("SearchExecuteBtn");
        if (ExecuteBtn) {
            ExecuteBtn.addEventListener("click", ExecuteSearch);
        }
    }

    /**
     * 検索実行
     */
    function ExecuteSearch() {
        const City = document.getElementById("SearchCity").value;
        const ShopName = document.getElementById("SearchShopName").value.trim();
        const Genre = document.getElementById("SearchGenre").value;
        const StatusRadio = document.querySelector('input[name="BusinessStatus"]:checked');
        const Status = StatusRadio ? StatusRadio.value : "";

        const Conditions = {
            Area: City,
            Keyword: ShopName,
            Genre: Genre,
            Status: Status
        };

        if (OnSearchCallback) {
            OnSearchCallback(Conditions);
        }
    }

    /**
     * 閉じる
     */
    function Close() {
        DialogBase.Close(DIALOG_ID);
    }

    return {
        LoadMasterData,
        Show,
        Close
    };
})();
