import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import "../styles/checkout.css";
import {
    saveAddress,
    saveShipping,
    savePayment,
    saveOrder
} from "../services/checkoutService";

function Checkout() {
    const [rates, setRates] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState("cashondelivery");
    const [selectedShipping, setSelectedShipping] = useState("");
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [order, setOrder] = useState(null);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "FR",
        postcode: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                billing: {
                    id: null,
                    address: [
                        formData.address
                    ],
                    save_as_address: false,
                    use_for_shipping: true,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    company_name: "Bagisto",
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    postcode: formData.postcode,
                    phone: formData.phone
                },

                shipping: {
                    id: null,
                    address: [
                        formData.address
                    ],
                    save_as_address: false,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    company_name: "Bagisto",
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    postcode: formData.postcode,
                    phone: formData.phone
                }

            };

            const data = await saveAddress(payload);
            console.log(data);
            setRates(data.data.rates);

            if (data.data.rates.length > 0) {

                setSelectedShipping(
                    data.data.rates[0].rates.method
                );

            }
            handleSaveShipping();
            handleSavePayment();
        } catch (error) {

            console.error(error);
        }
    };

    const handleSaveShipping = async () => {

        // try {
        //     console.log("selectedShipping  " + selectedShipping);
        //     const data = await saveShipping(
        //         selectedShipping
        //     );
        //     console.log("data apres selectedShipping  " + data);
        //     // setPaymentMethods([
        //     //     data.data[0].methods
        //     // ]);
        //     console.log(data);
        // } catch (error) {
        //     console.error(error);
        // }
        const data = await saveShipping(
            "free_free"
        );
        console.log(data);
    };
    const handleSavePayment = async () => {
        // try {
        //     const data = await savePayment(
        //         selectedPayment
        //     );
        //     console.log(data);
        // } catch (error) {
        //     console.error(error);
        // }
        const data = await savePayment(
            "cashondelivery"
        );
        console.log(data);
    };

    const handleSaveOrder = async () => {
        try {
            // await saveShipping(
            //     "free_free"
            // );
            // await savePayment(
            //     "cashondelivery"
            // );
            const data = await saveOrder();
            console.log(data);
            setOrder(data.data);
    
        } catch (error) {
    
            console.error(error);
    
        }
    
    };
    // return (

    //     <MainLayout>
    //         <h1>Checkout</h1>
    //         <form onSubmit={handleSubmit}>
    //             <input
    //                 type="text"
    //                 name="first_name"
    //                 placeholder="Prenom"
    //                 onChange={handleChange}
    //             />

    //             <input
    //                 type="text"
    //                 name="last_name"
    //                 placeholder="Nom"
    //                 onChange={handleChange}
    //             />

    //             <input
    //                 type="email"
    //                 name="email"
    //                 placeholder="Email"
    //                 onChange={handleChange}
    //             />

    //             <input
    //                 type="text"
    //                 name="phone"
    //                 placeholder="Telephone"
    //                 onChange={handleChange}
    //             />

    //             <input
    //                 type="text"
    //                 name="address"
    //                 placeholder="Adresse"
    //                 onChange={handleChange}
    //             />

    //             <input
    //                 type="text"
    //                 name="city"
    //                 placeholder="Ville"
    //                 onChange={handleChange}
    //             />

    //             <input
    //                 type="text"
    //                 name="state"
    //                 placeholder="Etat"
    //                 onChange={handleChange}
    //             />

    //             <input
    //                 type="text"
    //                 name="postcode"
    //                 placeholder="Code postal"
    //                 onChange={handleChange}
    //             />
    //             <p>Livraison : Gratuit</p>

    //             <p>Paiement : Cash On Delivery</p>
    //             <button type="submit">
    //                 Valider l'adress
    //             </button>

    //         </form>

    //     <button
    //         onClick={handleSaveOrder}
    //     >
    //         Confirmer Commande
    //     </button>
    //     {
    //         order && (

    //             <div>
    //                 <h2>
    //                     Commande créée !
    //                 </h2>
    //                 <p>
    //                     Numero :
    //                     {" "}
    //                     {order.data.increment_id}
    //                 </p>
    //                 <p>
    //                     Total :
    //                     {" "}
    //                     {order.data.formatted_grand_total}
    //                 </p>
    //             </div>

    //         )
    //     }
    //     </MainLayout>

    // );
    return (
        <MainLayout>
            <div className="page">
                <h1 className="page-title">Checkout</h1>
                <hr className="page-divider" />
    
                <div className="checkout-layout">
                    <form onSubmit={handleSubmit} className="checkout-form">
                        <input
                            type="text"
                            name="first_name"
                            placeholder="Prénom"
                            onChange={handleChange}
                            required
                        />
    
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Nom"
                            onChange={handleChange}
                            required
                        />
    
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                        />
    
                        <input
                            type="text"
                            name="phone"
                            placeholder="Téléphone"
                            onChange={handleChange}
                            required
                        />
    
                        <input
                            type="text"
                            name="address"
                            placeholder="Adresse"
                            onChange={handleChange}
                            required
                        />
    
                        <input
                            type="text"
                            name="city"
                            placeholder="Ville"
                            onChange={handleChange}
                            required
                        />
    
                        <input
                            type="text"
                            name="state"
                            placeholder="État / Région"
                            onChange={handleChange}
                        />
    
                        <input
                            type="text"
                            name="postcode"
                            placeholder="Code postal"
                            onChange={handleChange}
                            required
                        />
    
                        <button type="submit" className="btn form-full-width">
                            Valider l'adresse
                        </button>
                    </form>
    
                    <div className="checkout-summary">
                        <h3>Résumé de la commande</h3>
                        
                        <div className="checkout-info-row">
                            <span>Livraison</span>
                            <strong>Gratuit</strong>
                        </div>
    
                        <div className="checkout-info-row">
                            <span>Paiement</span>
                            <strong>Cash On Delivery</strong>
                        </div>
    
                        <button 
                            onClick={handleSaveOrder}
                            className="btn btn--accent"
                            style={{ marginTop: '1rem', width: '100%' }}
                        >
                            Confirmer Commande
                        </button>
    
                        {order && (
                            <div className="order-success-card">
                                <h2>Commande créée !</h2>
                                <p>
                                    {/* <strong>Numéro :</strong> {order.data.increment_id} */}
                                </p>
                                <p>
                                    {/* <strong>Total :</strong> {order.data.formatted_grand_total} */}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );

}
export default Checkout;