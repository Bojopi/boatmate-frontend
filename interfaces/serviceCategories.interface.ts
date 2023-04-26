export interface ServiceCategories {
    services: Service[];
}

export interface Service {
    id_service:             number;
    service_name:           string;
    service_description:    string;
    categories:             Category[];
}

export interface Category {
    id_category:        number;
    category_name:      string;
    service_categories: ServiceCategoriesClass;
}

export interface ServiceCategoriesClass {
    serviceId:  number;
    categoryId: number;
}
