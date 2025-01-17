import * as THREE from 'three';

export function getMouseVector2(event, window){
    let mousePointer = new THREE.Vector2()

    mousePointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	mousePointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    return mousePointer;
}

export function checkRayIntersections(mousePointer, camera, raycaster, scene, getFirstValue) {
    raycaster.setFromCamera(mousePointer, camera);

    let intersections = raycaster.intersectObjects(scene.children, true);

    intersections = getFirstValue ? intersections[0] : intersections;

    return intersections;
}

export function highlightObject(object, highlightColor = 0xffff00) {
    if (object && object.material) {
        object.originalColor = object.material.color.clone(); // Save the original color
        object.material.color.set(highlightColor); // Set highlight color
    }
    return;
}

export function unhighlightObject(object) {
    if (object && object.material && object.originalColor) {
        object.material.color.copy(object.originalColor); // Restore original color
    }
    return;
}