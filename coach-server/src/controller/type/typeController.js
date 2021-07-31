// parentObject - Object containing type property Ex. Time.TimeType
// typeProps - (Type) property
function mapTypes(parentObject, typeProps) {
    typeProps.forEach(typeProp => mapType(parentObject, typeProp))
}

function mapType(parentObject, typeProp) {
    if (parentObject[typeProp]) {
        parentObject[typeProp] = {
            connect: { id: parentObject[typeProp].id }
        }
    } else
        delete parentObject[typeProp];
}

module.exports = {
    mapTypes,
    mapType
}