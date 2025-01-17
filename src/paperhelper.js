import * as THREE from 'three';

export function getPaperObjects(objectList){
    const paperObjects = [];

    //If it's not an array return the value
    if(!Array.isArray(objectList)){
        if (objectList && objectList.object && objectList.object.name) {
        const objectName = objectList.object.name || "Unnamed Object";
            if (objectName.includes("paper")) {
                paperObjects.push(objectList.object);
            }
        }
        return paperObjects;
    }

    objectList.forEach((object) => {
        if (object && object.object && object.object.name) {
            const objectName = object.object.name || "Unnamed Object";
            if (objectName.includes("paper")) {
                paperObjects.push(object.object);
            }
        }
    });

    return paperObjects;
}

