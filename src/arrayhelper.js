// Function to get interactive objects by matching their names with keywords
/*
export function getInteractiveObjects(objectList, keywords) {
    let interactableObjects = [];

    // If it's not an array, process the single object
    if (!Array.isArray(objectList)) {
        if (objectList && objectList.object && objectList.object.name) {
            const objectName = objectList.object.name || "Unnamed Object";
            if (keywords.includes(objectName)) {
                interactableObjects.push(objectList.object);
            }
        }
        return interactableObjects;
    }

    // Iterate through the array of objects
    objectList.forEach((object) => {
        if (object && object.object && object.object.name) {
            const objectName = object.object.name || "Unnamed Object";
            if (keywords.includes(objectName)) {
                interactableObjects.push(object.object);
            }
        }
    });

    return interactableObjects;
}


// Function to get the corresponding message for a matched object
export function getMessage(interactableObject, keywords, newMessages) {
    if (!interactableObject || !interactableObject.name) {
        return null; // No valid object
    }

    const objectName = interactableObject.name || "Unnamed Object";
    const index = keywords.indexOf(objectName);

    if (index !== -1) {
        return newMessages[index]; // Return the corresponding message
    }

    return null; // No match found
}
*/

export const keywords = [
    "past", 
    "present", 
    "future", 
    "piano", 
    "airplane0",
    "airplane1",
    "airplane2",
    "airplane3",
    "airplane4",
    "airplane5", 
    "cube", 
    "butterfly1",
    "butterfly2",
    "butterfly3", 
    "butterfly4", 
    "butterfly5",
    "dancecirc1", 
    "dancecirc2",
    "death",  
    "alien", 
    "88", 
    "weakness", 
    "feeling",
    "couple", 
    "dive", 
    "death3", 
    "fragments",  
    "moon-1", 
    "woman",   
    "astronaut", 
    "2men", 
    "face",
    "flower", 
    "figure", 
    "death2"
]; // Add your filenames here


export const messages = [
    "the past...No matter how close you get, you can never quite touch it again",
    "the present...It is here and now, yet it slips through your fingers. Perhaps this fleeting moment is its own purpose",
    "the future...The further you walk, the more it changes shape—an endless pursuit of a fleeting vision.", 
    "do you hear it? I think I can hear someone playing Beethoven's Fur Elise softly.",
    "a message unsent, caught between here and there. Will it ever reach its destination?", 
    "flight log #0: Sent with no address, hoping the wind knows where to take it", 
    "this one was folded in a hurry. Hope it doesn’t nose-dive!", 
    "made from top-secret documents...and maybe also math homework.", 
    "rumor has it, this plane once circled the entire room without landing", 
    "took 3 tries to fold it just right.", 
    "is this three dimensional or two dimensional?", 
    "a tiny dancer in the air", 
    "wow if you think about it, this is transformation embodied...what is lost in becomingg something new?", 
    "the most delicate things are often the most profound", 
    "a fleeting life", 
    "its flutters sends unseen ripples that shape the world", 
    "time dissolves on the rhythmn of shared motion", 
    "look they're skipping through time",
    "mortality", 
    "what planet are you on?", 
    "infinity mirrored. In chinese, infinite luck.", 
    "It is just an illusion we have here on earth that one moment follows another one, like beads on a string, and that once a moment is gone it is gone forever.               - kurt vonnegut", 
    "sometimes I just feel like i need something to hold on to.",
    "i always see you even if i can't see you", 
    "a leap of faith. can i trust the future to catch me?", 
    "and the cycle of life and death continues", 
    "shards", 
    "a quiet witness to every dream" ,
    "lady of the moon...like 姮娥 (chang'e), sometimes i wish i were her", 
    "to infinity & beyond...",
    "two adventurers on a journey...",
    "bombastic side eye...maybe he's scared of butterflies",
    "ephemerality",
    "dance like there's no tomorrow", 
    "the end"
  ];