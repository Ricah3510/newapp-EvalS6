## Function
```jsx
function ImportDefaultImage() {
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const [logs, setLogs] = useState([]);

    const handleFileChange = (e) => {
        setImageFile(
            e.target.files[0]
        );
        setLogs([]);
    };

    const importDefaultImage = async () => {

        if (!imageFile) return;

        setLoading(true);
        const currentLogs = [];

        try {
            // récupérer tous les produits
            const response = await getProducts();

            const products = response.data;
            for (const product of products) {
                try {
                    await uploadProductImage(product.id, imageFile);

                    currentLogs.push({
                        status: "success",
                        label: `${product.sku} OK`
                    });

                } catch (error) {
                    currentLogs.push({
                        status: "error",
                        label: product.sku,
                        error:
                            error.response
                            ?.data
                            ?.message
                            ?? error.message
                    });
                }
                setLogs([
                    ...currentLogs
                ]);
            }
        } catch (error) {

            currentLogs.push({
                status: "error",
                label: "Erreur",
                error: error.message
            });

            setLogs([
                ...currentLogs
            ]);

        }

        setLoading(false);

    };
}
```