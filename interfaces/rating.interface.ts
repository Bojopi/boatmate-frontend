export interface Rating {
    id_rating:         number;
    rating:            number;
    review:            string;
    serviceProviderId: number;
    customerId:        number;
    service_provider:  ServiceProvider;
}

export interface ServiceProvider {
    id_service_provider: number;
    price:               number;
    providerIdProvider:  number;
    serviceIdService:    number;
}