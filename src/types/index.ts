type Image = {
    url: string;
    height: number;
    width: number;
};

type User = {
    country: string;
    display_name: string;
    email: string;
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    images: {
        height: number;
        width: number;
        url: string;
    }[];
    product: string;
    type: "string";
    uri: string;
};

type SpotifyArtist = {
    external_urls: {
        spotify: string;
    };
    followers: {
        href: string | null;
        total: number;
    };
    genres: string[];
    href: string;
    id: string;
    images: {
        url: string;
        height: number;
        width: number;
    }[];
    name: string;
    popularity: number;
    type: string;
    uri: string;
};

type SpotifyTrack = {
    album: {
        album_type: string;
        artists: SpotifyArtist[];
        available_markets: string[];
        external_urls: {
            spotify: string;
        };
        href: string;
        id: string;
        images: {
            url: string;
            height: number;
            width: number;
        }[];
        name: string;
        release_date: string;
        release_date_precision: string;
        total_tracks: number;
        type: string;
        uri: string;
    };
    artists: SpotifyArtist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
        isrc: string;
    };
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    is_local: boolean;
    name: string;
    popularity: number;
    preview_url?: null | string;
    track_number?: number | null;
    type?: "track";
    uri?: string | null;
    isSaved?: boolean;
};

type SpotifyAlbum = {
    album_type: string;
    artists: SpotifyArtist[];
    available_markets: string[];
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    images: {
        url: string;
        height: number;
        width: number;
    }[];
    name: string;
    release_date: string;
    release_date_precision: string;
    total_tracks: number;
    type: "album";
    uri: string;
    tracks: {
        items: SpotifyTrack[];
    };
    copyrights: {
        text: string;
        type: string;
    }[];
};

type SpotifyPlaylist = {
    collaborative: boolean;
    description: string;
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    images: [
        {
            url: string;
            height: number;
            width: number;
        },
    ];
    name: string;
    owner: {
        external_urls: {
            spotify: string;
        };
        href: string;
        id: string;
        type: "user";
        uri: string;
        display_name: string;
        images: Image[];
    };
    public: false;
    snapshot_id: string;
    tracks: {
        href: string;
        total: number;
        items: [
            {
                added_at: string;
                track: SpotifyTrack;
            },
        ];
    };
    type: string;
    uri: string;
};

export type { User, SpotifyArtist, SpotifyTrack, SpotifyAlbum, SpotifyPlaylist, Image };
