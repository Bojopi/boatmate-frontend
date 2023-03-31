export const BoatMateService = {
    getBoatMateData() {
        return [
            {
                id: '1000',
                code: 'f230fh0g3',
                name: 'Maintenance & Repair',
                image: 'https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/e4f26a1b-ae0f-4de4-99ca-af3ffd5cc1af/iStock-1223426084.jpg',
            },
            {
                id: '1001',
                code: 'nvklal433',
                name: 'Electronics',
                image: 'https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/9ed98063-aadb-46dd-a1af-dec2236e241e/unsplash_xt4AV4P-SVg.jpg',
            },
            {
                id: '1002',
                code: 'zz21cz3c1',
                name: 'Boat Detailing & Hull Cleaning',
                image: 'https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/0916a54d-a1ca-4837-a5c9-0559f987a070/iStock-909436586.jpg',
            },
            {
                id: '1003',
                code: '244wgerg2',
                name: 'Bottom Painting',
                image: 'https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/407fd413-aa79-46f4-8cc1-d914803f55ce/iStock-1332436935.jpg',
            },
            {
                id: '1004',
                code: 'h456wer53',
                name: 'Sound & Entertaiment',
                image: 'https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/fc2aed34-7df6-400a-b6b9-b180ae15fe35/unsplash_QpdTJkESlN0.png',
            },
            {
                id: '1005',
                code: 'av2231fwg',
                name: 'Transportation',
                image: 'https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/17e8f72d-fbe0-448a-baba-472c977b8e67/iStock-1266713739.jpg',
            },
            {
                id: '1006',
                code: 'bib36pfvm',
                name: 'Marine Sales & Purchases',
                image: 'https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/052ed352-5dc9-4615-b50d-162adddab5d2/iStock-523873021+%281%29.jpg',
            },
        ];
    },


    getServicesMini() {
        return Promise.resolve(this.getBoatMateData().slice(0, 5));
    },

    getServicesSmall() {
        return Promise.resolve(this.getBoatMateData().slice(0, 10));
    },

    getServices() {
        return Promise.resolve(this.getBoatMateData());
    },
};

