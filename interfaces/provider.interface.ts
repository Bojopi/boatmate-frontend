export interface Providers {
    providers: Provider[];
}

export interface Provider {
    id_provider:          number;
    provider_name:        string;
    provider_description: string;
    zip:                  string;
    provider_image:       string;
    email:                string;
    phone:                string;
}
