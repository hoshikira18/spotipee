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

export type { User, SpotifyArtist };
