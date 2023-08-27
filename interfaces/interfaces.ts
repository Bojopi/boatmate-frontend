export interface GeneralUser {
    id_profile:           number;
    email:                string;
    id_role:              number;
    role_description:     string;
    role_state:           boolean;
    person_name:          string;
    lastname:             string;
    phone:                string;
    person_image:         string;
    provider_name?:        string;
    provider_image?:       string;
    provider_description?: string;
    provider_lat?:         string;
    provider_lng?:         string;
    provider_zip?:         string;
    profile_state?:        boolean;
    customer_lat?:          string;
    customer_lng?:          string;
    customer_zip?:          null;
}

export interface User {
    id_profile:    number;
    email:         string;
    profile_state: boolean;
    google:        boolean;
    roleId:        number;
    personId:      number;
    person:        Person;
    role:          Role;
}

export interface Person {
    id_person:    number;
    person_name:  string;
    lastname:     string;
    phone:        string;
    person_image: null | string;
}

export interface Role {
    id_role:          number;
    role_state:       boolean;
    role_description: string;
}

export interface Profile {
    uid:                 number;
    email:               string;
    state:               boolean;
    google:               boolean;
    idPerson:            number;
    name:                string;
    lastname:            string;
    phone:               string;
    image:               string;
    idRole:              number;
    role:                string;
    idProvider:          number;
    providerName:        string;
    providerImage:       string;
    providerDescription: string;
    providerLat:         string;
    providerLng:         string;
    idCustomer:          string;
    customerLat:         string;
    customerLng:         string;
    iat:                 number;
    exp:                 number;
}

export interface Provider {
    id_provider:          number;
    id_profile:           number;
    provider_name:        string;
    provider_description: string;
    provider_lat:         string;
    provider_lng:         string;
    provider_image:       string;
    email:                string;
    profile_state:        boolean;
    phone:                string;
    person_name:          string;
    lastname:             string;
    provider_zip:         string;
    provider_license:     string;
}

export interface ProviderServices {
    id_service_provider:          number;
    service_provider_state:       boolean;
    service_provider_description: null | string;
    id_service:                   number;
    service_name:                 string;
}

export interface Customer {
    id_customer:    number;
    customer_lat:   string;
    customer_lng:   string;
    customer_zip:   string;
    email:          string;
    person_name:    string;
    lastname:       string;
    phone:          string;
    profile_state:  boolean;
    id_profile:     number;
}

export interface Boat {
    id_boat:     number;
    type:        string;
    model:       string;
    brand:       string;
    year:        number;
    length:      string;
    boat_lat:    string;
    boat_lng:    string;
    person_name: string;
    lastname:    string;
    id_profile:  number;
    phone:       string;
}

export interface Service {
    id_service:          number;
    service_name:        string;
    service_description: string;
    service_state:       boolean;
    service_categories?:  ServiceCategory[];
    service_providers?:   ServiceProvider[];
}

export interface ServiceCategory {
    categoryIdCategory: number;
    category:           Category;
}

export interface Category {
    id_category:   number;
    category_name: string;
}

export interface ServiceHistory {
    id_contract:          number;
    contract_date:        Date;
    contract_state:       string;
    contract_description: string;
    id_service_provider:  number;
    price:                number;
    id_provider:          number;
    provider_name:        string;
    id_service:           number;
    service_name:         string;
    id_customer:          number;
    email:                string;
    person_name:          string;
    lastname:             string;
    phone:                string;
}

export interface Portofolio {
    id_portofolio:          number;
    portofolio_image:       string;
    portofolio_description: null | string;
    providerId:             number;
}

export interface Gallery {
    id_gallery:          number;
    gallery_image:       string;
    contractId:          number;
}

export interface Ratings {
    id_rating:                    number;
    rating:                       number;
    review:                       string;
    rating_date:                  Date;
    provider_visible:              boolean;
    id_service_provider:          number;
    service_provider_description: string;
    id_provider:                  number;
    provider_name:                string;
    provider_image:               string;
    id_service:                   number;
    service_name:                 string;
    id_customer:                  number;
    email:                        string;
    person_name:                  string;
    lastname:                     string;
    phone:                        string;
    person_image:                 null | string;
}

export interface ServiceProvider {
    id_service_provider:          number;
    service_provider_state:       boolean;
    service_provider_description: string;
    providerIdProvider:           number;
    serviceIdService:             number;
    provider:                     Provider;
}

export interface ContractProvider {
    id_contract:            number;
    contract_date:          Date;
    contract_date_finished: Date;
    contract_state:         string;
    contract_description:   string;
    contract_price:         number;
    service_provider_state: boolean;
    email:                  string;
    person_name:            string;
    person_image:           string;
    lastname:               string;
    phone:                  string;
    service_name:           string;
}

export interface ContractCustomer {
    id_contract:            number;
    contract_date:          Date;
    contract_state:         string;
    contract_description:   string;
    contract_price:         number;
    service_provider_state: boolean;
    service_name:           string;
    id_provider:            number;
    provider_name:          string;
    provider_image:         string;
    provider_lat:           string;
    provider_lng:           string;
    provider_zip:           string;
    email:                  string;
    person_name:            string;
    lastname:               string;
    phone:                  string;
}

export interface Hired {
    id_contract:         number;
    contract_count:      string;
    id_service:          number;
    service_name:        string;
    service_description: null | string;
    service_image:       null | string;
    provider_lat:        string;
    provider_lng:        string;
    provider_zip:        string;
    count?:              number;
}

export interface Conversation {
    id_conversation:    number;
    conversation_state: boolean;
    contractId:         number;
}

export interface Message {
    id_message:     number;
    message_text:   string;
    message_date:   Date;
    message_read:   boolean;
    id_provider:    number | null;
    provider_name:  string | null;
    provider_image: string | null;
    id_customer:    number | null;
    person_name:    string | null;
    lastname:       string | null;
}