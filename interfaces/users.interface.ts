export interface Users {
    users: User[];
}

export interface User {
    id_profile:    number;
    email:         string;
    password:      string;
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
    role_description: string;
}
