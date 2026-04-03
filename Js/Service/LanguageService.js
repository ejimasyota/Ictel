/**
 * 多言語対応サービス
 */
const LanguageService = (() => {
    const STORAGE_KEY = "AppLanguage";
    let CurrentLang = "ja";
    let Listeners = [];

    /**
     * 初期化
     */
    function Init() {
        const Saved = localStorage.getItem(STORAGE_KEY);
        CurrentLang = Saved === "en" ? "en" : "ja";
    }

    /**
     * 現在の言語を取得
     */
    function GetLang() {
        return CurrentLang;
    }

    /**
     * 言語データを取得
     */
    function GetText() {
        return CurrentLang === "en" ? LangEn : LangJa;
    }

    /**
     * 言語を切り替え
     */
    function ToggleLang() {
        CurrentLang = CurrentLang === "ja" ? "en" : "ja";
        localStorage.setItem(STORAGE_KEY, CurrentLang);
        Listeners.forEach((Fn) => Fn(CurrentLang));
    }

    /**
     * 英語かどうか
     */
    function IsEnglish() {
        return CurrentLang === "en";
    }

    /**
     * 言語変更リスナーを登録
     */
    function OnChange(Fn) {
        Listeners.push(Fn);
    }

    /**
     * リスナーを解除
     */
    function OffChange(Fn) {
        Listeners = Listeners.filter((L) => L !== Fn);
    }

    Init();

    return {
        GetLang,
        GetText,
        ToggleLang,
        IsEnglish,
        OnChange,
        OffChange
    };
})();
