import {
  ALL_RELATIONSHIP_TABLES,
  MOVIE_GENRES,
  MOVIE_KEYWORDS,
  MOVIE_ACTORS,
  MOVIE_DIRECTORS,
  MOVIE_PRODUCTION_COMPANIES
} from "../src/table-names";
import { Database } from "../src/database";
import { tableInfo } from "../src/queries/table-info";
import { minutes, Log } from "./utils";

const CREATE_MOVIE_GENRES_TABLE = `
  CREATE TABLE ${MOVIE_GENRES} (
    movie_id integer NOT NULL,
    genre_id integer NOT NULL,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES Movies(id),
    FOREIGN KEY (genre_id) REFERENCES Genres(id)
  )`;

const CREATE_MOVIE_ACTORS_TABLE = `
  CREATE TABLE ${MOVIE_ACTORS} (
    movie_id integer NOT NULL,
    actor_id integer NOT NULL,
    PRIMARY KEY (movie_id, actor_id),
    FOREIGN KEY (movie_id) REFERENCES Movies(id),
    FOREIGN KEY (actor_id) REFERENCES Actors(id)
  )`;

const CREATE_MOVIE_DIRECTORS_TABLE = `
  CREATE TABLE ${MOVIE_DIRECTORS} (
    movie_id integer NOT NULL,
    director_id integer NOT NULL,
    PRIMARY KEY (movie_id, director_id),
    FOREIGN KEY (movie_id) REFERENCES Movies(id),
    FOREIGN KEY (director_id) REFERENCES Directors(id)
  )`;

const CREATE_MOVIE_KEYWORDS_TABLE = `
  CREATE TABLE ${MOVIE_KEYWORDS} (
    movie_id integer NOT NULL,
    keyword_id integer NOT NULL,
    PRIMARY KEY (movie_id, keyword_id),
    FOREIGN KEY (movie_id) REFERENCES Movies(id),
    FOREIGN KEY (keyword_id) REFERENCES Keywords(id)
  )`;

const CREATE_MOVIE_PRODUCTION_COMPANIES_TABLE = `
  CREATE TABLE ${MOVIE_PRODUCTION_COMPANIES} (
    movie_id integer NOT NULL,
    company_id integer NOT NULL,
    PRIMARY KEY (movie_id, company_id),
    FOREIGN KEY (movie_id) REFERENCES Movies(id),
    FOREIGN KEY (company_id) REFERENCES ProductionCompanies(id)
  )`;

const expectedColumns: Record<string, { name: string; type: string }[]> = {
  [MOVIE_GENRES]: [
    { name: "movie_id", type: "integer" },
    { name: "genre_id", type: "integer" }
  ],
  [MOVIE_ACTORS]: [
    { name: "movie_id", type: "integer" },
    { name: "actor_id", type: "integer" }
  ],
  [MOVIE_DIRECTORS]: [
    { name: "movie_id", type: "integer" },
    { name: "director_id", type: "integer" }
  ],
  [MOVIE_KEYWORDS]: [
    { name: "movie_id", type: "integer" },
    { name: "keyword_id", type: "integer" }
  ],
  [MOVIE_PRODUCTION_COMPANIES]: [
    { name: "movie_id", type: "integer" },
    { name: "company_id", type: "integer" }
  ]
};

describe("Insert Combined Data", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("03", "04");
  }, minutes(3));

  const selectTableInfo = async (table: string) => {
    return db.selectMultipleRows(tableInfo(table));
  };

  it("should create tables to manage relationships", async (done) => {
    const queries = [
      CREATE_MOVIE_GENRES_TABLE,
      CREATE_MOVIE_ACTORS_TABLE,
      CREATE_MOVIE_DIRECTORS_TABLE,
      CREATE_MOVIE_KEYWORDS_TABLE,
      CREATE_MOVIE_PRODUCTION_COMPANIES_TABLE
    ];

    for (const query of queries) {
      await db.createTable(query);
    }

    for (const table of ALL_RELATIONSHIP_TABLES) {
      const exists = await db.tableExists(table);
      Log.info(`Checking '${table}'`);
      expect(exists).toBeTruthy();
    }

    done();
  });

  it("should have correct columns and column types", async (done) => {
    const mapFn = (row: any) => {
      return {
        name: row.name,
        type: row.type
      };
    };

    // Iterate through the relationship tables and check their columns and types
    for (const table of ALL_RELATIONSHIP_TABLES) {
      const columns = (await selectTableInfo(table)).map(mapFn);
      expect(columns).toEqual(expectedColumns[table]);
    }

    done();
  });

  it("should have primary keys", async (done) => {
    const mapFn = (row: any) => {
      return {
        name: row.name,
        primaryKey: row.pk > 0
      };
    };

    // Iterate through the relationship tables and check their primary keys
    for (const table of ALL_RELATIONSHIP_TABLES) {
      const columns = (await selectTableInfo(table)).map(mapFn);
      const expectedPrimaryKeys = expectedColumns[table].filter((col) =>
        col.name.endsWith("_id")
      );
      for (const col of columns) {
        if (col.name.endsWith("_id")) {
          expect(col.primaryKey).toBeTruthy();
        } else {
          expect(col.primaryKey).toBeFalsy();
        }
      }
    }

    done();
  });

  it("should have not null constraints", async (done) => {
    const mapFn = (row: any) => {
      return {
        name: row.name,
        notNull: row.notnull === 1
      };
    };

    // Iterate through the relationship tables and check their not null constraints
    for (const table of ALL_RELATIONSHIP_TABLES) {
      const columns = (await selectTableInfo(table)).map(mapFn);
      for (const col of columns) {
        expect(col.notNull).toBeTruthy();
      }
    }

    done();
  });
});