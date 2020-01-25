function createJSON(jsonString) {
  try {
    let o;
    if (typeof jsonString === "object") {
      o = jsonString;
    }
    else {
      o = JSON.parse(jsonString);
    }

    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns null, and typeof null === "object", 
    // so we must check for that, too. Thankfully, null is falsey, so this suffices:
    if (o && typeof o === "object") {
      let keys = Object.keys(o);
      for (let key of keys) {
        o[key] = createJSON(o[key]);
      }
      return o;
    }
  }
  catch (e) { 
    // console.log(`An error was caught, the error is ${e}`);
    // console.log(`The object type is ${typeof jsonString}`)
    // console.log(`The thing to be parsed was  ${jsonString}`);
  }
  return jsonString;
}
module.exports = createJSON;