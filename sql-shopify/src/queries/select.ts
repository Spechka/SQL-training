import { APPS, APPS_CATEGORIES, CATEGORIES, REVIEWS } from "../shopify-table-names";

export const selectCount = (table: string): string => {
  return(
    `SELECT COUNT (*) AS c FROM ${table}`
  );
};

export const selectRowById = (id: number, table: string): string => {
  return(
    `SELECT * FROM ${table}
    WHERE id = ${id}`
  );
};

export const selectCategoryByTitle = (title: string): string => {
  return(
    `SELECT * FROM ${CATEGORIES}
    WHERE title = '${title}'`
  );
};

export const selectAppCategoriesByAppId = (appId: number): string => {
  return(
    `SELECT app.title AS app_title, category_id, categ.title AS category_title FROM ${APPS_CATEGORIES}
    JOIN ${APPS} app ON ${APPS_CATEGORIES}.app_id = app.id
    JOIN ${CATEGORIES} categ ON ${APPS_CATEGORIES}.category_id = categ.id
    WHERE app_id = ${appId}
    `);
};

export const selectUnigueRowCount = (tableName: string, columnName: string): string => {
  return(
    `SELECT COUNT(DISTINCT ${columnName}) AS c FROM ${tableName}`
    );
};

export const selectReviewByAppIdAuthor = (appId: number, author: string): string => {
  return(
    `SELECT * FROM ${REVIEWS}
    WHERE app_id = ${appId}
    AND author = '${author}'
    `);
};

export const selectColumnFromTable = (columnName: string, tableName: string): string => {
  return(
    `SELECT ${columnName} FROM ${tableName}`);
};

