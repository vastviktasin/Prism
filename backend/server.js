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
    const { prUrl } = req.body;

    console.log("Received PR:", prUrl);

    const parts = prUrl.split("/");

    const owner = parts[3];
    const repo = parts[4];
    const pullNumber = parts[6];

    const { data: pr } =
      await octokit.pulls.get({
        owner,
        repo,
        pull_number: pullNumber,
      });
      const aiResponse =
  await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are an elite senior software engineer reviewing pull requests. Summarize pull requests clearly and concisely for developers.",
      },
      {
        role: "user",
        content: `
Title:
${pr.title}

Description:
${pr.body || "No description provided"}

Changed Files:
${pr.changed_files}

Additions:
${pr.additions}

Deletions:
${pr.deletions}
        `,
      },
    ],

    model: "llama-3.3-70b-versatile",
  });

const aiSummary =
  aiResponse?.choices?.[0]?.message?.content ||
  "AI could not generate a summary.";
  console.log("AI Summary:", aiSummary);

    res.json({
  success: true,

  title: pr.title,

  author: pr.user.login,

    summary: aiSummary,

  riskScore:
    Math.floor(Math.random() * 40) + 60,

  complexity:
    pr.changed_files > 10
      ? "High"
      : pr.changed_files > 5
      ? "Medium"
      : "Low",

  tags: [
    "GitHub",
    "Pull Request",
    "AI Review",
  ],

  additions: pr.additions,

  deletions: pr.deletions,

  changedFiles: pr.changed_files,
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