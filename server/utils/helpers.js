function removeUnmatchedBrackets(str) {
  const stack = [];

  const chars = str.split("");

  const pairs = {
    "(": ")",
    "{": "}",
    "[": "]",
  };

  chars.forEach((char, index) => {
    if (pairs[char]) {
      stack.push({ char, index });
    } else if (Object.values(pairs).includes(char)) {
      const last = stack.pop();

      if (!last || pairs[last.char] !== char) {
        chars[index] = "";
        if (last) {
          chars[last.index] = "";
        }
      }
    }
  });

  stack.forEach(({ index }) => {
    chars[index] = "";
  });

  return chars.join("");
}

function getNextSaturday(inputDate) {
  const date = new Date(inputDate);
  const dayOfWeek = date.getUTCDay();

  const daysToAdd = dayOfWeek === 6 ? 0 : 6 - dayOfWeek;

  if (daysToAdd !== 0) {
    date.setDate(date.getDate() + daysToAdd);
  }

  return date.toISOString().split("T")[0];
}

module.exports = { removeUnmatchedBrackets, getNextSaturday };
