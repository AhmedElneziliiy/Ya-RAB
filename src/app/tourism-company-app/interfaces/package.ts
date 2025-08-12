export interface Package {
    packageId: string;
    companyId: string;
    packageName: string;
    description: string;
    price: string;
    durationDays: number;
    startDate: string;
    endDate: string;
    companyName: string;
    destinations?: Destination[];
    destinationIds?: string[];
    photoUrls?: string[],
}

export interface Destination {
    destinationId: string;
    name: string;
    description: string;
    location: string;
}
