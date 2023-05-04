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
    zip:                 string;
    providerDescription: string;
    providerLat:         string;
    providerLng:         string;
    idCustomer:          string;
    customerLat:         string;
    customerLng:         string;
    iat:                 number;
    exp:                 number;
}