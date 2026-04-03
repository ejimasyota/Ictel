/**
 * ブックマーク管理サービス（localStorage）
 */
const BookmarkService = (() => {
    const STORAGE_KEY = "ShopBookmarks";

    /**
     * 全ブックマークを取得
     */
    function GetAll() {
        try {
            const Data = localStorage.getItem(STORAGE_KEY);
            return Data ? JSON.parse(Data) : [];
        } catch (E) {
            console.warn("ブックマークの読み込みに失敗しました", E);
            return [];
        }
    }

    /**
     * ブックマークを保存
     */
    function SaveAll(Bookmarks) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Bookmarks));
    }

    /**
     * ブックマークに追加
     */
    function Add(Shop) {
        const All = GetAll();
        if (All.some((Item) => Item.Id === Shop.Id)) {
            return false;
        }
        All.push({
            Id: Shop.Id,
            Name: Shop.Name,
            Genre: Shop.Genre,
            Photo: Shop.Photo,
            PhotoSmall: Shop.PhotoSmall,
            Open: Shop.Open,
            Address: Shop.Address
        });
        SaveAll(All);
        return true;
    }

    /**
     * ブックマークから削除
     */
    function Remove(ShopId) {
        const All = GetAll();
        const Filtered = All.filter((Item) => Item.Id !== ShopId);
        SaveAll(Filtered);
    }

    /**
     * ブックマーク済みか判定
     */
    function IsBookmarked(ShopId) {
        return GetAll().some((Item) => Item.Id === ShopId);
    }

    /**
     * 全削除
     */
    function ClearAll() {
        SaveAll([]);
    }

    /**
     * 件数取得
     */
    function Count() {
        return GetAll().length;
    }

    return {
        GetAll,
        Add,
        Remove,
        IsBookmarked,
        ClearAll,
        Count
    };
})();
