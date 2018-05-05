const jsonParser = (jsonString) => {
  try {
    const jsonOutput = JSON.parse(jsonString);
    return jsonOutput;
  } catch (e) {
    if (e) {
      console.log('JSON Error:', e);
    }
  }
  return undefined;
}

module.exports = jsonParser;
