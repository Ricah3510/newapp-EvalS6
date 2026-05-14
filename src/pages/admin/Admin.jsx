import { useEffect, useState } from "react";
import { getAdmin } from "../../services/admin/adminService";
import MainLayout from "../../layouts/admin/MainLayout";

function Admin() {

    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        loadAdmin();
    }, []);

    const loadAdmin = async () => {
        try {
            const data = await getAdmin();
            console.log(data);
            setAdmin(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <MainLayout>
            <div>

                <h1>Page Admin</h1>
                {
                    admin && (
                        <div>
                            <h2>
                                {admin.name}
                            </h2>
                            <p>
                                {admin.email}
                            </p>
                        </div>
                    )
                }
            </div>
        </MainLayout>
    );

}

export default Admin;