export interface ServiceHistory {
    serviceHistory: ServiceHistoryElement[];
}

export interface ServiceHistoryElement {
    id_service_provider:  number;
    price:                number;
    service_name:         string;
    provider_name:        string;
    person_name:          string;
    lastname:             string;
    date:                 Date;
    contract_state:       string;
    contract_description: string;
}
