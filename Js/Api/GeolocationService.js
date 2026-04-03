/**
 * ブラウザGeolocation APIラッパー
 */
const GeolocationService = (() => {
    /**
     * 現在地を取得
     * @returns {Promise<{Lat: number, Lng: number}>}
     */
    function GetCurrentPosition() {
        return new Promise((Resolve, Reject) => {
            if (!navigator.geolocation) {
                Reject(new Error("Geolocation is not supported"));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (Position) => {
                    Resolve({
                        Lat: Position.coords.latitude,
                        Lng: Position.coords.longitude
                    });
                },
                (Error) => {
                    Reject(Error);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        });
    }

    return {
        GetCurrentPosition
    };
})();
