const Groq = require("groq-sdk");
const { Octokit } = require("@octokit/rest");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("PRism backend running");
});

app.post("/analyze", async (req, res) => {
  try {
    console.log("Analyze route hit");

    const { prUrl } = req.body;

    console.log("PR URL:", prUrl);

    const githubPrRegex =
      /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)$/;

    const match = prUrl.match(githubPrRegex);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid GitHub Pull Request URL",
      });
    }

    const owner = match[1];
    const repo = match[2];
    const pullNumber = match[3];

    console.log("Parsed URL");

    const { data: pr } =
      await octokit.pulls.get({
        owner,
        repo,
        pull_number: pullNumber,
      });

    console.log("Fetched PR");

    const { data: files } =
      await octokit.pulls.listFiles({
        owner,
        repo,
        pull_number: pullNumber,
      });

    console.log("Fetched files");

    if (files.length > 25) {
  return res.status(400).json({
    success: false,
    message:
      "PR too large for current analysis engine.",
  });
}

    const diffText = files
      .map((file) => {
        return `
FILE: ${file.filename}

STATUS: ${file.status}

PATCH:
${file.patch || "No patch available"}
`;
      })
      .join("\n-------------------\n");

    console.log("Built diff text");

    const WEIGHTS = {
      security: { score: 30, cap: 40 },
      database: { score: 25, cap: 35 },
      infrastructure: { score: 20, cap: 25 },
      dependencies: { score: 15, cap: 20 },
      criticalOps: { score: 25, cap: 35 },
    };

    const categoryScores =
      Object.fromEntries(
        Object.keys(WEIGHTS).map(
          (key) => [key, 0]
        )
      );

    files.forEach((file) => {
      const name =
        file.filename.toLowerCase();

      const addedLines =
        (file.patch || "")
          .split("\n")
          .filter(
            (line) =>
              line.startsWith("+") &&
              !line.startsWith("+++")
          )
          .join("\n")
          .toLowerCase();

      if (
        name.includes("auth") ||
        name.includes("login") ||
        name.includes("security") ||
        addedLines.includes("token") ||
        addedLines.includes("jwt") ||
        addedLines.includes("password")
      ) {
        categoryScores.security +=
          WEIGHTS.security.score;
      }

      if (
        name.includes("db") ||
        name.includes("schema") ||
        name.includes("migration") ||
        addedLines.includes("sql")
      ) {
        categoryScores.database +=
          WEIGHTS.database.score;
      }

      if (
        name.includes("config") ||
        name.includes(".env") ||
        name.includes("docker") ||
        name.includes("workflow")
      ) {
        categoryScores.infrastructure +=
          WEIGHTS.infrastructure.score;
      }

      if (
        name.includes("package-lock") ||
        name.includes("yarn.lock") ||
        name.includes("package.json")
      ) {
        categoryScores.dependencies +=
          WEIGHTS.dependencies.score;
      }

      if (
        addedLines.includes("eval(") ||
        addedLines.includes("exec(") ||
        addedLines.includes("admin") ||
        addedLines.includes("permission")
      ) {
        categoryScores.criticalOps +=
          WEIGHTS.criticalOps.score;
      }
    });

    const riskScore = Math.min(
      100,

      Object.entries(categoryScores)
        .reduce(
          (
            total,
            [category, score]
          ) => {
            return (
              total +
              Math.min(
                score,
                WEIGHTS[category].cap
              )
            );
          },

          10
        )
    );

    const riskBreakdown =
      Object.entries(categoryScores)

        .filter(
          ([, score]) => score > 0
        )

        .map(
          ([category, score]) => {
            return `${category}: ${Math.min(
              score,
              WEIGHTS[category].cap
            )
              }`;
          }
        )

        .join(", ");

    console.log("Calculated risk score");

    const prompt = `
You are an expert senior software engineer.

Analyze this GitHub Pull Request.

PR TITLE:
${pr.title}

PR DESCRIPTION:
${pr.body || "No description"}

RISK BREAKDOWN:
${riskBreakdown}

CODE DIFFS:
${diffText.slice(0, 12000)}

Provide:
1. Concise summary
2. Main technical changes
3. Potential risks
4. Complexity assessment
`;

    console.log("Calling Groq...");

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "system",
            content:
              "You are an expert AI code reviewer.",
          },

          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.3,
      });

    console.log("Groq response received");

    const aiSummary =
  completion.choices?.[0]?.message?.content
  || "AI summary unavailable.";

    const tags = [];

    files.forEach((file) => {
      const name =
        file.filename.toLowerCase();

      if (
        name.includes("auth") &&
        !tags.includes("Security")
      ) {
        tags.push("Security");
      }

      if (
        name.includes("db") ||
        name.includes("schema")
      ) {
        if (
          !tags.includes("Database")
        ) {
          tags.push("Database");
        }
      }

      if (
        name.includes("api")
      ) {
        if (!tags.includes("API")) {
          tags.push("API");
        }
      }

      if (
        name.includes("config")
      ) {
        if (
          !tags.includes(
            "Infrastructure"
          )
        ) {
          tags.push(
            "Infrastructure"
          );
        }
      }
    });

    if (tags.length === 0) {
      tags.push("Code Review");
    }

    console.log("Sending response");

    res.json({
      success: true,

      title: pr.title,

      author: pr.user.login,

      summary: aiSummary,

      riskScore,

      riskBreakdown,

      complexity:
        pr.changed_files > 10
          ? "High"
          : pr.changed_files > 5
            ? "Medium"
            : "Low",

      tags,

      additions: pr.additions,

      deletions: pr.deletions,

      changedFiles:
        pr.changed_files,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to analyze PR",
    });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});