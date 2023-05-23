import { axios } from "@/config/axios";


export const Categories = () => {

    const getAllCategories = () => axios.get('/categories');

    const show = (idCategory: number) => axios.get(`/category/${idCategory}`);

    const createCategory = (data: any, categories: any, setCategories: any, setLoading: any, toast: any, setVisible: any) => {
        axios.post('/category', data)
        .then((res) => {
            const category = res.data.category;
            setVisible(false);
            setCategories([...categories, category]);
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            setLoading(false);
        })
        .catch((error) => {
            console.log(error.response.data.msg);
            setVisible(false);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    };

    const updateCategory = (idCategory: number, data: any, categories: any, setCategories: any, setLoading: any, toast: any, setVisible: any) => {
        axios.post(`/category/${idCategory}`, data)
        .then((res) => {
            const category = res.data.category[1][0];
            setVisible(false);
            setCategories(categories.map((item: any) => {
                if (item.id_category === idCategory) {
                    return {...categories, ...category};
                }
                return item;
            }));
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            setLoading(false);
        })
        .catch((error) => {
            console.log(error.response.data.msg);
            setVisible(false);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    };

    const deleteCategory = (idCategory: number) => axios.delete(`/delete-category/${idCategory}`);


    return {
        getAllCategories,
        show,
        createCategory,
        updateCategory,
        deleteCategory
    }
}

