import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
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
    return (

        <MainLayout>
            <h1>Checkout</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="first_name"
                    placeholder="Prenom"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="last_name"
                    placeholder="Nom"
                    onChange={handleChange}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="phone"
                    placeholder="Telephone"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="address"
                    placeholder="Adresse"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="city"
                    placeholder="Ville"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="state"
                    placeholder="Etat"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="postcode"
                    placeholder="Code postal"
                    onChange={handleChange}
                />
                <p>Livraison : Gratuit</p>

                <p>Paiement : Cash On Delivery</p>
                <button type="submit">
                    Valider l'adress
                </button>

            </form>

            {/* <h2>2-Livraison</h2>
            {
                rates.map((rate) => (
                    <div
                        key={rate.rates[0].method}
                    >
                        <input
                            type="radio"
                            name="shipping"
                            value={
                                rate.rates[0].method
                            }

                            checked={
                                selectedShipping
                                === rate.rates[0].method
                            }

                            onChange={(e) =>
                                setSelectedShipping(
                                    e.target.value
                                )
                            }
                        />

                        <span>

                            {rate.carrier_title}

                            {" - "}

                            {
                                rate.rates.formatted_price
                            }

                        </span>
                    </div>

                ))
                
            }
            <button
                onClick={handleSaveShipping}
            >
                Etape 2/3 OK
            </button>

            <h2>3 - Paiement</h2>
            {
                paymentMethods.map((payment) => (

                    <div key={payment.method}>

                        <input
                            type="radio"

                            value={payment.method}

                            checked={
                                selectedPayment
                                === payment.method
                            }

                            onChange={(e) =>
                                setSelectedPayment(
                                    e.target.value
                                )
                            }
                        />

                        <span>
                            {payment.method_title}
                        </span>

                    </div>

                ))
            }
            <button
                onClick={handleSavePayment}
            >
                Confirmer Paiement
            </button> */}

        <button
            onClick={handleSaveOrder}
        >
            Confirmer Commande
        </button>
        {
            order && (

                <div>
                    <h2>
                        Commande créée !
                    </h2>
                    <p>
                        Numero :
                        {" "}
                        {order.increment_id}
                    </p>
                    <p>
                        Total :
                        {" "}
                        {order.formatted_grand_total}
                    </p>
                </div>

            )
        }
        </MainLayout>

    );

}
export default Checkout;