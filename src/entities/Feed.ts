export interface Feed {
    id: string;
    title: string;
    url: string;
    latestUpdate?: Date;
    userAccessTime?: Date;
}