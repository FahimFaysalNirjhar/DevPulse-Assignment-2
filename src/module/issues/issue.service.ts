import { pool } from "../../db";
import type { IIssue } from "./issue.interface";

const createIssueInToDB = async (payload: IIssue) => {
  const { title, description, type, status, reporter_id } = payload;

  const result = await pool.query(
    `
    INSERT INTO issues(title, description, type, status,reporter_id) VALUES($1,$2,$3,COALESCE($4,'open'),$5)  RETURNING *
    `,
    [title, description, type, status, reporter_id],
  );

  return result;
};

const getAllIssuesFromDB = async (queryData: any) => {
  const { sort, type, status } = queryData;
  let query = `SELECT * FROM issues`;

  const values: string[] = [];
  const conditions: string[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type=$${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`status=$${values.length}`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  if (sort === "oldest") {
    query += ` ORDER BY created_at ASC`;
  } else {
    query += ` ORDER BY created_at DESC`;
  }

  const result = await pool.query(query, values);

  const issues = await Promise.all(
    result.rows.map(async (issue) => {
      const user = await pool.query(
        `SELECT id, name, role FROM users WHERE id=$1`,
        [issue.reporter_id],
      );
      const { reporter_id, ...rest } = issue;

      return {
        ...rest,
        reporter: user.rows[0],
      };
    }),
  );

  return issues;
};

const getSingleIssueFromDB = async (id: string) => {
  const result = await pool.query(
    `
    SELECT * FROM issues WHERE id=$1
    `,
    [id],
  );

  const issue = result.rows[0];

  const user = await pool.query(
    `
    SELECT id, name, role FROM users WHERE id=$1
    `,
    [issue.id],
  );

  const { reporter_id, ...rest } = issue;

  return {
    ...rest,
    reporter: user.rows[0],
  };
};

export const issueService = {
  createIssueInToDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
};
