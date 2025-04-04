type Image = {
    url: string;
    height: number;
    width: number;
};

export const getImage = (size: number, images?: Image[]) => {
    return images?.find((img) => img.height === size)?.url;
};
