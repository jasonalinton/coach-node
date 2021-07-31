let scalarTypes = {
    int: "Int",
    string: "String",
    dateTime: "DateTime"
};

let tableTypes = {
    type: "Type",
    time: "Time"
};

let dataType = {
    ...scalarTypes,
    ...tableTypes
}

// Text - Property name
// Type - Datebase table type
class Property {
    constructor(text, dataType) {
        this.text = text;
        this.dataType = dataType
    }
}

module.exports = {
    scalarTypes,
    tableTypes,
    dataType,
    Property,
}