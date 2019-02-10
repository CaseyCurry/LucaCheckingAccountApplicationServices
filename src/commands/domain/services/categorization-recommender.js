const CategorizationRecommender = {
  recommend: transactions => {
    let words = groupByWords(transactions);
    let groups = mergeWords(words);
    return Object.keys(groups)
      .map(group => groups[group])
      .map(group => {
        return {
          phrase: group.phrase,
          transactions: [
            ...new Set(group.transactions.map(transaction => transaction.id))
          ]
        };
      });
  }
};

export { CategorizationRecommender };

const groupByWords = transactions => {
  const words = {};

  transactions.forEach(transaction => {
    const description = ignorePhrases(transaction.description);
    const wordsInTransaction = description
      .toUpperCase()
      .replace("'", "")
      .split(" ");
    let added = false;

    wordsInTransaction.forEach(word => {
      word = ignoreRegex(word);
      if (word) {
        word = ignoreWords(word);
      }
      if (word) {
        added = true;
        if (!words[word]) {
          words[word] = {
            word: word,
            transactions: [transaction]
          };
        } else {
          words[word].transactions.push(transaction);
        }
      }
    });

    // Make sure every transaction is added at least once.
    if (!added) {
      if (words["Ungrouped"]) {
        words["Ungrouped"].transactions.push(transaction);
      } else {
        words["Ungrouped"] = {
          word: "Ungrouped",
          transactions: [transaction]
        };
      }
    }
  });

  return words;
};

const ignoreRegex = word => {
  const regexsToIgnore = [
    /^\d{2}\/\d{2}\/\d{4}$/, // date
    /^\d{2}\/\d{2}\/\d{2}$/, // date
    /^\d{2}\/\d{2}$/, // date
    /^\d{3}-\d{3}-\d{4}$/, // phone number
    /^\d{2}:\d{2}$/, // time
    /^-#/, // accounts
    /^#/ // accounts
  ];

  for (const regexToIgnore of regexsToIgnore) {
    if (regexToIgnore.test(word)) {
      return "";
    }
  }

  return word;
};

const ignorePhrases = description => {
  const phrasesToIgnore = [
    "D/C SETTLEMENT",
    "Pre auth",
    "POS Debit",
    "ACH Debit",
    "ONLINE PMT",
    "POST ATM DEBIT",
    "DBT CRD",
    "POS Recurring Debit",
    "LOC:",
    "ACH Credit"
  ];

  phrasesToIgnore.forEach(phraseToIgnore => {
    if (description.includes(phraseToIgnore)) {
      description = description
        .split(phraseToIgnore)
        .join("")
        .split(phraseToIgnore.toLowerCase())
        .join("")
        .split(phraseToIgnore.toUpperCase())
        .join("");
    }
  });

  return description;
};

const ignoreWords = word => {
  const removeDates = true;
  const removeNumbers = true;
  const minimumWordLengthToGroup = 3;
  const wordsToIgnore = [
    "DEBIT",
    "Rowlett",
    "Garland",
    "Nashville",
    "Plano",
    "Dallas",
    "Brentwood",
    "Seattle",
    "CITY",
    "&amp;",
    "CHAR",
    "Trace",
    "TRACE#",
    "9500000000",
    "CKF555076855POS",
    "#-CKF555076855POS",
    "Card",
    "Card#",
    "Store",
    "Direct",
    "Service",
    "Energy",
    "Casey",
    "Curry",
    "POS",
    "LLC",
    "ATM",
    "DDA",
    "DEB",
    "ID#",
    "DEP",
    "THE",
    "INC",
    "SAN",
    "SVC"
  ];

  for (const wordToIgnore of wordsToIgnore) {
    if (word.toLowerCase() === wordToIgnore.toLowerCase()) {
      return "";
    }
  }

  if (word.length < minimumWordLengthToGroup) {
    return "";
  }

  if (removeDates && !isNaN(Date.parse(word))) {
    return "";
  }

  if (removeNumbers && !isNaN(word)) {
    return "";
  }

  return word;
};

const mergeWords = words => {
  const groups = {};

  for (const word in words) {
    let merged = false;

    for (const mergedWord in groups) {
      if (areEqual(groups[mergedWord].transactions, words[word].transactions)) {
        groups[mergedWord].phrase += " " + words[word].word;
        merged = true;
      }
    }

    if (!merged) {
      groups[word] = {
        phrase: words[word].word,
        transactions: words[word].transactions
      };
    }
  }

  return groups;
};

const areEqual = (x, y) => {
  if (x.length !== y.length) {
    return false;
  }
  return JSON.stringify(x) === JSON.stringify(y);
};
