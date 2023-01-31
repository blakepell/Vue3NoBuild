// JS functions via ES6 module.

/**
 * (Async) Returns an object from a url using the GET method.
 */
async function HttpGet(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    catch (e) {
        console.error(e);
    }
}

/**
 * (Async) Posts data and returns an object from the URL.
 */
async function HttpPost(url, data) {
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        });

        const json = await response.json();
        return json;
    }
    catch (e) {
        console.error(e);
    }
}

/**
 * (Async) Makes a DELETE call and returns a true if a status 200 is returned or
 * false otherwise.
 */
async function HttpDelete(url) {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
        });

        if (response.ok) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (e) {
        console.error(e);
    }

    return false;
}

/**
 * Checks if a string is null, empty or undefined.
 */
function IsNullOrEmpty(str) {
    if (str === null || str === undefined || str === "") {
        return true;
    }

    return false;
}

/**
 * Returns the specified number of characters from the left side of the input string.
 */
function Left(str, len) {
    if (IsNullOrEmpty(str)) {
        return str;
    }

    if (len > str.length) {
        len = str.length;
    }

    return str.substring(0, len);
}

/**
 * Returns the specified number of characters from the right side of the input string.
 */
function Right(str, len) {
    if (IsNullOrEmpty(str)) {
        return str;
    }

    if (len > str.length) {
        len = str.length;
    }

    return str.substring(str.length - len, str.length);
}

/**
 * A case insensitive startsWith.
 */
function StartsWith(searchStr, searchFor) {
    if (IsNullOrEmpty(searchStr) || IsNullOrEmpty(searchFor)) {
        return false;
    }

    return searchStr.toUpperCase().startsWith(searchFor.toUpperCase());
}

/**
 * A case insensitive endsWith
 */
function EndsWith(searchStr, searchFor) {
    if (IsNullOrEmpty(searchStr) || IsNullOrEmpty(searchFor)) {
        return false;
    }

    return searchStr.toUpperCase().endsWith(searchFor.toUpperCase());
}

/**
 * A case insensitive search for one string in another.
 */
function Contains(searchStr, searchFor) {
    if (IsNullOrEmpty(searchStr) || IsNullOrEmpty(searchFor)) {
        return false;
    }

    return searchStr.toUpperCase().includes(searchFor.toUpperCase());
}

/**
 * Capitalizes the first letter of a string.
 */
function Capitalize(str) {
    if (IsNullOrEmpty(str)) {
        return str;
    }

    return str.charAt(0).toUpperCase() + this.slice(1);
}

/**
 * Formats a phone number.
 */
function FormatPhoneNumber(phoneNumber) {
    if (IsNullOrEmpty(phoneNumber)) {
        return phoneNumber;
    }

    const str = phoneNumber.replace(" ", "").replace("(", "").replace(")", "").replace("-", "");

    switch (str.length) {
        case 7:
            return `${Left(str, 3)}-${Right(str, 4)}`;
        case 10:
            return `${Left(str, 3)}-${str.slice(3, 6)}-${Right(str, 4)}`;
        case 11:
            return `${str.charAt(0)}-${str.slice(1, 4)}-${str.slice(4, 7)}-${Right(str, 4)}`;
        default:
            return str;
    }
}

/**
 * Formats the currency showing dollars and cents in US currency format.
 */
function FormatCurrency(amount) {
    if (IsNullOrEmpty(amount)) {
        return "$0.00";
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

/**
 * Returns the first non null and defined argument from the provided arguments.
 */
function Coalesce() {
    // Loop through the arguments
    for (let i = 0; i < arguments.length; i++) {
        // If the argument is not null or undefined, return it
        if (arguments[i] !== null && arguments[i] !== undefined) {
            return arguments[i];
        }
    }

    // If no non-null/undefined arguments were found, return null
    return null;
}

/**
 * Formats a timestamp.
 */
function FormatTimestamp(timestamp) {
    // Use the toLocaleDateString and toLocaleTimeString methods to
    // get the formatted date and time strings
    const dateString = timestamp.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const timeString = timestamp.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
    });

    // Return the formatted date and time strings separated by a space
    return `${dateString} ${timeString}`;
}

/**
 * Formats a timestamp returning only the date potion.
 */
function FormatTimestampDateOnly(timestamp) {
    // Use the toLocaleDateString and toLocaleTimeString methods to
    // get the formatted date and time strings
    const dateString = timestamp.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Return the formatted date and time strings separated by a space
    return dateString;
}

/**
 * Generates a slug from the provided text.
 */
function GenerateSlug(string) {
    // Convert the string to lowercase and remove any non-alphanumeric characters
    const slug = string.replaceAll(' ', '-').toLowerCase().replace(/[^a-z0-9-]/g, '');

    // Replace any runs of multiple hyphens with a single hyphen
    return slug.replace(/-+/g, '-');
}

/**
 *  If any object is empty (or a valid object but contains no keys)
 */
function IsEmpty(obj) {
    return Object.keys(obj).length === 0;
}

/**
 * Sorts an array of objects by a property name for an "asc" or "desc" sort order.
 */
function ColumnSort(dataSource, column, sortOrder) {
    // Sorting has to be done in the page because it is what has access to the data
    // source to mutate it.
    return dataSource.sort((a, b) => {
        if (a[column] === b[column]) {
            return 0;
        }

        if (sortOrder === "asc") {
            return a[column] < b[column] ? -1 : 1;
        }
        else {
            return b[column] < a[column] ? -1 : 1;
        }
    });
}

/**
 * Determines if the input is a number.
 */
function IsNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Function to save a JSON object to local storage.
 */
function SetObject(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Function to save a raw string value to local storage.
 */
function SetString(key, value) {
    localStorage.setItem(key, value);
}

/**
 * Function to retrieve a JSON object from local storage (run through
 * JSON.parse).
 */
function GetObject(key) {
    return JSON.parse(localStorage.getItem(key));
}

/**
 * Function to retrieve a raw string value from local storage.
 */
function GetString(key) {
    return localStorage.getItem(key);
}

/**
 * Function to remove a JSON object (or key) from local storage.
 */
function RemoveObject(key) {
    localStorage.removeItem(key);
}

/**
 * Function to see if an object exists in the local storage. 
 */
function ObjectExists(key) {
    return localStorage.getItem(key) !== null;
}

/**
 * Returns an array of the keys of all items accessible in local storage.
 */
function ListObjects() {
    let keys = [];

    for (let i = 0; i < localStorage.length; i++) {
        keys.push(localStorage.key(i));
    }

    return keys;
}

/**
 * Performs a binary search on an array of objects provided an array, a key
 * to search and a value.  Requires pre-sorting of the array.
 */
function BinarySearch(arr, key, value) {
    let start = 0;
    let end = arr.length - 1;

    while (start <= end) {
        let mid = Math.floor((start + end) / 2);

        if (arr[mid][key] === value) {
            return arr[mid];
        }

        if (arr[mid][key] < value) {
            start = mid + 1;
        }
        else {
            end = mid - 1;
        }
    }

    return null;
}

/**
 *  Compares all of an objects properties to a filter and returns
 *  true if any property partially matches.
 */
function ObjectFilter(obj, filter) {
    filter = filter.toLowerCase();

    for (const prop in obj) {
        if (obj[prop]?.toString().toLowerCase().includes(filter)) {
            return true;
        }
    }

    return false;
}

/**
 * Takes an array and a string and returns a new array composed of elements that had any properties whose values contained the passed in string
 * @param {array} arr
 * @param {string} filterValue
 */
function ArrayFilter(arr, filterValue) {
    return arr.filter(listItem => Object.values(listItem).some(prop => Contains(prop?.toString(), filterValue)))
}

export { IsNumeric, ColumnSort, Left, Right, StartsWith, EndsWith, Contains, Capitalize, FormatPhoneNumber, FormatCurrency, Coalesce, FormatTimestamp, FormatTimestampDateOnly, GenerateSlug, HttpGet, IsEmpty, IsNullOrEmpty, SetObject, GetObject, RemoveObject, ListObjects, GetString, SetString, BinarySearch, ObjectExists, ObjectFilter, ArrayFilter }