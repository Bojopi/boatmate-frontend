export interface Providers {
    providers: Provider[];
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
}
