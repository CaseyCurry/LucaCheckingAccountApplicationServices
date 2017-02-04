"use strict";

const validStatuses = {
  "validateStatus": (status) => {
    return status == 200 || status == 404;
  }
};

module.exports = (database, dataUrl, views) => {
  return new Promise((resolve, reject) => {
    configureDb(database, dataUrl, views)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const configureDb = (database, dataUrl, views) => {
  return database
    .get(dataUrl, validStatuses)
    .then((response) => {
      if (response.status == 404) {
        return createDatabase(database, dataUrl)
          .then(() => {
            return configureViews(database, dataUrl, views);
          })
          .catch((error) => {
            Promise.reject(error);
          });
      } else {
        return configureViews(database, dataUrl, views);
      }
    });
};

const createDatabase = (database, dataUrl) => {
  return database
    .put(dataUrl);
};

const configureViews = (database, dataUrl, views) => {
  const viewsUrl = dataUrl + "/_design/doc";
  return database
    .get(viewsUrl, validStatuses)
    .then((response) => {
      if (response.status == 404) {
        return createViews(database, viewsUrl, views);
      } else {
        return createViews(database, viewsUrl, views, response.data);
      }
    });
};

const createViews = (database, viewsUrl, newViews, existingViews) => {
  if (existingViews &&
    JSON.stringify(existingViews.views) == JSON.stringify(newViews.views) &&
    existingViews.language == newViews.language) {
    return Promise.resolve();
  }
  return database
    .put(viewsUrl, Object.assign({}, existingViews, newViews));
};
