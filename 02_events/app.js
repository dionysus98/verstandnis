const EventEmitter = require("events");

class Emitter extends EventEmitter { }

const myE = new Emitter();

myE.on("foo", (x) => {
    console.log("An event occured with: ", x);
    console.log(this)
});

// arrow functions ignore the bind for this to event emitters
myE.on("bar", (x) => {
    myE.emit("foo", "bar")
    console.log(this)
});

// removes this register once an emit is occurred.
myE.once("foo", function () {
    console.log("An event occured once.");
    console.log(this)
});

myE.emit("bar");
myE.emit("foo", 1);
myE.emit("foo", "what?");

console.log(myE.eventNames())
