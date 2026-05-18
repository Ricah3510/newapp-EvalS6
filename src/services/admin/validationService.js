const EXPECTED_HEADERS = {
    customers: ["nom", "prenom", "email", "pwd"],
    products:  ["type", "sku", "name", "Categorie", "prix_vente", "prix_achat", "prix_promo", "stock_initial"],
    orders:    ["date", "heure", "client", "achat", "status"],
};

const validateHeaders = (firstLine, type) => {
    const expected = EXPECTED_HEADERS[type];
    const actual   = firstLine.split(",").map((h) => h.trim());

    const errors = [];
    expected.forEach((col, i) => {
        if (actual[i] !== col) {
            errors.push(
                `Colonne ${i + 1} : attendu "${col}", trouvé "${actual[i] ?? "manquant"}"`
            );
        }
    });
    return errors;
};

const isValidDate = (value) => {
    if (!value) return false;
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(value)) return false;

    const [day, month, year] = value.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    return (
        date.getFullYear() === year &&
        date.getMonth()    === month - 1 &&
        date.getDate()     === day
    );
};

export const toMysqlDate = (ddmmyyyy) => {
    const [day, month, year] = ddmmyyyy.split("/");
    return `${year}-${month}-${day}`;
};

const isPositiveAmount = (value) => {
    if (value === undefined || value === null || value.trim() === "") return true;
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0;
};

export const validateCustomersCSV = (text) => {
    const lines  = text.split("\n").filter((l) => l.trim() !== "");
    const errors = [];

    const headerErrors = validateHeaders(lines[0], "customers");
    if (headerErrors.length > 0) {
        errors.push({ line: 1, messages: headerErrors });
        return errors;
    }

    lines.slice(1).forEach((line, i) => {
        const lineNum = i + 2;
        const [last_name, first_name, email, password] = line.split(",").map((v) => v?.trim());
        const lineErrors = [];

        if (!last_name)   lineErrors.push("Nom manquant");
        if (!first_name)  lineErrors.push("Prénom manquant");
        if (!email || !email.includes("@")) lineErrors.push(`Email invalide : "${email}"`);
        if (!password || password.length < 6) lineErrors.push("Mot de passe trop court (min 6 caractères)");

        if (lineErrors.length > 0) errors.push({ line: lineNum, messages: lineErrors });
    });

    return errors;
};

export const validateProductsCSV = (text) => {
    const lines  = text.split("\n").filter((l) => l.trim() !== "");
    const errors = [];

    const headerErrors = validateHeaders(lines[0], "products");
    if (headerErrors.length > 0) {
        errors.push({ line: 1, messages: headerErrors });
        return errors;
    }

    lines.slice(1).forEach((line, i) => {
        const lineNum = i + 2;
        const [type, sku, name, categorie, prix_vente, prix_achat, prix_promo, stock_initial] =
            line.split(",").map((v) => v?.trim());
        const lineErrors = [];

        // if (!["simple", "virtual", "configurable"].includes(type)) {
        //     lineErrors.push(`Type invalide : "${type}" (attendu: simple, virtual, configurable)`);
        // }
        if (!sku)       lineErrors.push("SKU manquant");
        if (!name)      lineErrors.push("Nom manquant");
        if (!categorie) lineErrors.push("Catégorie manquante");

        if (!isPositiveAmount(prix_vente))    lineErrors.push(`prix_vente invalide : "${prix_vente}"`);
        if (!isPositiveAmount(prix_achat))    lineErrors.push(`prix_achat invalide : "${prix_achat}"`);
        if (!isPositiveAmount(prix_promo))    lineErrors.push(`prix_promo invalide : "${prix_promo}"`);
        if (!isPositiveAmount(stock_initial)) lineErrors.push(`stock_initial invalide : "${stock_initial}"`);

        if (lineErrors.length > 0) errors.push({ line: lineNum, messages: lineErrors });
    });

    return errors;
};

export const validateOrdersCSV = (text) => {
    const lines  = text.split("\n").filter((l) => l.trim() !== "");
    const errors = [];

    const headerErrors = validateHeaders(lines[0], "orders");
    if (headerErrors.length > 0) {
        errors.push({ line: 1, messages: headerErrors });
        return errors;
    }

    lines.slice(1).forEach((line, i) => {
        const lineNum = i + 2;

        const regex = /(".*?"|[^,]+)(?=,|$)/g;
        const cols  = [];
        let match;
        while ((match = regex.exec(line)) !== null) {
            cols.push(match[1].replace(/^"|"$/g, "").trim());
        }

        const [date, heure, client, achat, status] = cols;
        const lineErrors = [];

        if (!isValidDate(date)) {
            lineErrors.push(`Date invalide : "${date}" (attendu: DD/MM/YYYY)`);
        }

        if (!heure || !/^\d{2}:\d{2}$/.test(heure)) {
            lineErrors.push(`Heure invalide : "${heure}" (attendu: HH:MM)`);
        }

        if (!client || !client.includes("@")) {
            lineErrors.push(`Email client invalide : "${client}"`);
        }

        if (!achat) {
            lineErrors.push("Achat manquant");
        }

        if (!["pending", "completed"].includes(status)) {
            lineErrors.push(`Status invalide : "${status}" (attendu: pending ou completed)`);
        }

        if (lineErrors.length > 0) errors.push({ line: lineNum, messages: lineErrors });
    });

    return errors;
};