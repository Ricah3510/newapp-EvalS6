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

1-------
{product.regular_price != product. price ? ( <p>EN PROMO </p>
                                            )
}

2-----

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

## Multi Saisie
```jsx
import { useState } from "react";

function MultipleForm() {
    // Depart 5 lignes
    const [items, setItems] = useState(
        Array.from(
            { length: 5 },
            () => ({
                nom: "",
                prix: ""
            })
        )
    );
    // Depart 1 ligne
    const [items, setItems] = useState([
            {
                nom: "",
                prix: ""
            }
        ]);

    const handleChange = ( index, field, value ) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([ ...items,
            {
                nom: "",
                prix: ""
            }
        ]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(items);
    };

    return (
        <form onSubmit={handleSubmit} >
            {
                items.map( (item, index) => (
                    <div key={index}>
                        <input type="text"
                            placeholder="Nom"
                            value={item.nom}
                            onChange ={(e) =>
                                handleChange(index,"nom",e.target.value)
                            }

                        />

                        <input

                            type="number"

                            placeholder="Prix"

                            value={item.prix}

                            onChange={(e) =>

                                handleChange(

                                    index,

                                    "prix",

                                    e.target.value
                                )
                            }

                        />

                    </div>

                ))
            }

            <button

                type="button"

                onClick={addItem}

            >

                Ajouter ligne

            </button>

            <button type="submit">

                Envoyer

            </button>

        </form>

    );

}

export default MultipleForm;
```
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

##Checkbox
```jsx
import { useState }
from "react";

function MonCheckbox() {

    const [checked, setChecked] = useState(false);

    const handleChange = (e) => {
        setChecked(
            e.target.checked
        );
        console.log(
            e.target.checked
        );
    };

    return (
        <div>
            <input type="checkbox"
                checked={checked}
                onChange={handleChange}
            />

            <label>
                Accepter
            </label>

            <p>
                {
                    checked
                    ? "Coché"
                    : "Non coché"
                }
            </p>
        </div>
    );

}

export default MonCheckbox;
```

## radio
```jsx
import { useState } from "react";

export default function Livraison() {

    const [livraison, setLivraison] = useState("");

    return (
        <div>

            <h3>Choix livraison</h3>

            <label>
                <input
                    type="radio"
                    name="livraison"
                    value="standard"
                    onChange={(e) => setLivraison(e.target.value)}
                />
                Standard
            </label>

            <br />

            <label>
                <input
                    type="radio"
                    name="livraison"
                    value="express"
                    onChange={(e) => setLivraison(e.target.value)}
                />
                Express
            </label>

            <p>Choix : {livraison}</p>

        </div>
    );
}
```


## uploadImage
```jsx
<div>
    <input type="file" accept="image/*"
        onChange={
            handleFileChange
        }
    />

    <button
        onClick={
            importDefaultImage
        }
        disabled={loading}
    >

        {
            loading
            ? "Import..."
            : "Importer"
        }

    </button>
    <div>
        {
            logs.map(
                (log, index) => (
                <p key={index}>
                    [{log.status}]
                    {" "}
                    {log.label}
                </p>
            ))
        }
    </div>

</div>
```


## Recherche
```jsx
import { useState }
from "react";

function Recherche({data,field }) {

    const [search, setSearch] = useState("");
    const results = data.filter((item) =>
            item[field]
            ?.toLowerCase()
            .includes(
                search.toLowerCase()
            )
        );

    return (
        <div>
            <input
                type="text"
                placeholder="Recherche..."
                value={search}
                onChange={(e) =>
                    setSearch(
                        e.target.value
                    )
                }
            />
            <div>
                {
                    results.map(
                        (item) => (
                        <p key={item.id}>
                            {
                                item[field]
                            }
                        </p>
                    ))
                }
            </div>
        </div>
    );
}

export default Recherche;
```

## Panier vide
```jsx
const cartData = await getCart();
if (!cartData.data?.items || cartData.data.items.length === 0) {
    logs.push({ status: "error", label: row.client, error: "Panier vide — tous les articles ont été ignorés" });
    setOrderLogs([...logs]);
    continue; // ← passer à la commande suivante
}
```


##Filtre date
```jsx
const dateCommande = new Date( order.created_at );

const debut = new Date("2026-05-01");

const fin = new Date("2026-05-31");

if (
    dateCommande >= debut
    &&
    dateCommande <= fin
) {
    console.log(
        "Commande du mois"
    );
}

```

##Filtre mois
```jss
//Input:
<input

    type="month"

    value={selectedMonth}

    onChange={(e) =>

        setSelectedMonth(
            e.target.value
        )
    }

/>

const [selectedMonth,setSelectedMonth] = useState("");

const filteredOrders =
    orders.filter((order) => {
        const orderMonth =
            new Date(
                order.created_at
            )
            .toISOString()
            .slice(0, 7);
        return (
            orderMonth === selectedMonth
        );
    });
```


```jsx
const month =
    new Date()
    .getMonth()
    + 1;
console.log(month);

const now =
    new Date();

const currentMonth =

    now

    .toISOString()

    .slice(0, 7);

console.log(
    currentMonth
);
```