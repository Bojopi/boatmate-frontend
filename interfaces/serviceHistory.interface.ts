export interface ServiceHistory {
    serviceHistory: ServiceHistoryElement[];
}

export interface ServiceHistoryElement {
    id_contract:          number;
    date:                 Date;
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
