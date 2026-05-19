```jsx
//CSS conditionnelle
<td
    style={{
        color:
            order.status === "completed"
                ? "green"
                : order.status === "pending"
                ? "orange"
                : "#666"
    }}
    >
    {order.status}
</td>
```



```jsx 

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
```

## Status-color
```jsx
const StatusBadge = ({ status }) => {
    const map = {
        pending:    "pending",
        processing: "processing",
        completed:  "completed",
        canceled:   "canceled",
    };
    const labels = {
        pending:    "En attente",
        processing: "En cours",
        completed:  "Livré",
        canceled:   "Annulé",
    };
    return (
        <span className={`order-status ${map[status] ?? ""}`}>
            {labels[status] ?? status}
        </span>
    );
};
```

```CSS
.order-status.pending {
    background: #FEF3C7;
    color:      #92400E;
}

.order-status.processing {
    background: #DBEAFE;
    color:      #1E40AF;
}

.order-status.completed {
    background: #D1FAE5;
    color:      #065F46;
}

.order-status.canceled {
    background: #FEE2E2;
    color:      #991B1B;
}
```

## Trie Croissant
```js
// numerique
const sortedOrders = [...orders].sort(
    (a, b) => b.id - a.id
);
// [...orders] => evite de modifier directement state React


// alphabetique
commandes.sort(
    (a, b) => a.status.localeCompare(b.status)
);

// date
commandes.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
);
```

## Filtre
```js
//Format Initial
tableau.filter(
    condition
)

// Nombres
const expensiveProducts = products
    .filter( (product) => product.price > 500 );

// Texte
const clientsRakoto = clients
    .filter( (client) => client.nom === "Rakoto" );

// Contient
const results = products
    .filter( (product) =>
        product.name.toLowerCase()
        .includes(search.toLowerCase())
);
```


## Exemple Select + Filtre
```jsx
// state
const [selectedStatus, setSelectedStatus] = useState("");

// select
<select value={selectedStatus}
    onChange={(e) => setSelectedStatus(e.target.value ) }
>

    <option value=""> Tous </option>

    <option value="pending"> Pending </option>

    <option value="processing"> Processing </option>

    <option value="completed"> Completed </option>

    <option value="canceled"> Canceled </option>

</select>

//fonction Filtre
const filteredOrders = orders
    .filter((order) => {
        if ( selectedStatus === "" ) {
            return true;
        }
        return ( order.status === selectedStatus );
    });

//Changement dans l'affichage
filteredOrders.map(...)
//au lieu de
ordres.map(...)
```


## Formulaire
```jsx
import { useState }
from "react";

function MonFormulaire() {

    const [nom, setNom] = useState("");

    const [age, setAge] = useState("");

    const [dateNaissance, setDateNaissance] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(nom);
        console.log(age);
        console.log(dateNaissance);
    };

    return (
        <form onSubmit={handleSubmit} >
            <input type="text" placeholder="Nom" value={nom}
                onChange={(e) =>
                    setNom(
                        e.target.value
                    )
                }
            />

            <br />

            <input type="number" placeholder="Age" value={age}
                onChange={(e) =>
                    setAge(
                        e.target.value
                    )
                }
            />

            <br />

            <inpu type="date" value={dateNaissance}
                onChange={(e) =>
                    setDateNaissance(
                        e.target.value
                    )
                }
            />

            <br />

            <button type="submit">
                Envoyer
            </button>
        </form>
    );
}

export default MonFormulaire;
```