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

export type { User };
