import type { PlaylistTrack, PlaylistTracksReference } from "spotify-types";

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

type PlaylistGenres = {
    [key: string]: number;
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
    genres?: PlaylistGenres;
};

type SpotifyPlaybackState = {
    device: {
        id: string;
        is_active: boolean;
        is_private_session: boolean;
        is_restricted: boolean;
        name: string;
        type: string;
        volume_percent: number;
        supports_volume: boolean;
    };
    repeat_state: string;
    shuffle_state: boolean;
    context: {
        type: string;
        href: string;
        external_urls: {
            spotify: string;
        };
        uri: string;
    } | null;
    timestamp: number;
    progress_ms: number;
    is_playing: boolean;
    item: {
        album: {
            album_type: string;
            total_tracks: number;
            available_markets: string[];
            external_urls: {
                spotify: string;
            };
            href: string;
            id: string;
            images: Array<{
                url: string;
                height: number;
                width: number;
            }>;
            name: string;
            release_date: string;
            release_date_precision: string;
            restrictions?: {
                reason: string;
            };
            type: string;
            uri: string;
            artists: Array<{
                external_urls: {
                    spotify: string;
                };
                href: string;
                id: string;
                name: string;
                type: string;
                uri: string;
            }>;
        };
        artists: Array<{
            external_urls: {
                spotify: string;
            };
            href: string;
            id: string;
            name: string;
            type: string;
            uri: string;
        }>;
        available_markets: string[];
        disc_number: number;
        duration_ms: number;
        explicit: boolean;
        external_ids: {
            isrc: string;
            ean: string;
            upc: string;
        };
        external_urls: {
            spotify: string;
        };
        href: string;
        id: string;
        is_playable: boolean;
        linked_from?: object;
        restrictions?: {
            reason: string;
        };
        name: string;
        popularity: number;
        preview_url: string;
        track_number: number;
        type: string;
        uri: string;
        is_local: boolean;
    } | null;
    currently_playing_type: string;
    actions: {
        interrupting_playback: boolean;
        pausing: boolean;
        resuming: boolean;
        seeking: boolean;
        skipping_next: boolean;
        skipping_prev: boolean;
        toggling_repeat_context: boolean;
        toggling_shuffle: boolean;
        toggling_repeat_track: boolean;
        transferring_playback: boolean;
    };
};

type SpotifyDevice = {
    id: string;
    is_active: boolean;
    is_private_session: boolean;
    is_restricted: boolean;
    name: string;
    supports_volume: boolean;
    type: string;
    volume_percent: number;
};
type ChartOptions = {
    series: number[] | { data: number[] }[];
    options: {
        chart: ApexChart;
        labels?: string[];
        plotOptions?: ApexPlotOptions;
        dataLabels?: ApexDataLabels;
        legend?: ApexLegend;
        xaxis?: ApexXAxis;
        yaxis?: ApexYAxis;
    };
};

export interface PlaylistTracks extends PlaylistTracksReference {
    items: PlaylistTrack[];
}

export type {
    User,
    SpotifyArtist,
    SpotifyTrack,
    SpotifyAlbum,
    SpotifyPlaylist,
    PlaylistGenres,
    SpotifyDevice,
    Image,
    SpotifyPlaybackState,
    ChartOptions,
};
