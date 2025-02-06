# Simple De‌ep Research

This is a project where I try to develop a research agent that gathers and synthesizes online information through a multi-step workflow. It has the ability to clarify queries, generate precise search queries, evaluate and extract insights from web content, and compile comprehensive research reports. 

This is probably the simplest implementation of [OpenAI's Deep Research](https://openai.com/index/introducing-deep-research/) agent, designed for educational purposes!

https://github.com/user-attachments/assets/6e31801d-514a-41ab-8780-d694b9625632

<sup>A preview of the agent, using `gpt-4o-mini` (I don't have access to the `o3-mini` model).</sup>
<br><sup>The generated research report can be found here: [research.md](https://github.com/minh-ton/simple-deep-research/blob/main/research.md)</sup>

## How It Works
Here's a detailed overview of the agent's workflow:

1. Ask the LLM to generate follow-up questions to clarify the research direction.
2. Recursively process the user's query:
   - Ask the LLM to generate precise search queries based on the user’s query.
   - Perform a Google search using the generated queries and fetch the text from each result.  
   - Evaluate whether a webpage is useful for the research by prompting the LLM.  
   - If a webpage is useful, extract relevant information based on both the queries and the webpage content.  
   - Assess whether the collected content and search queries sufficiently answer the research question. If not, generate additional search queries to continue the search.  
3. Generate the final research report.

## Running The Agent
First, install the required dependencies using the following command:
```sh
pnpm install
```

Next, obtain the API keys for the [OpenAI API](https://platform.openai.com/docs/overview) and [Firecrawl](https://docs.firecrawl.dev/introduction).

Once you have the API keys, create a `.env.local` file in your project directory, and set up the environment variables as follows:
```sh
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
FIRECRAWL_API_KEY="YOUR_FIRECRAWL_API_KEY"
```

To start the agent, execute the following command:
```sh
pnpm run start
```

The agent will start the research process by requesting a research query. You'll also need to answer several follow-up questions to refine the research focus. The agent will then execute the research workflow. The final report will be saved in your project directory, specifically under the `research.md` file.

## Configuring The Agent
You can tweak the agent's configuration by editing the `constant-config.json` file. Here's a brief explanation of the settings:
```
"RESEARCH_DEPTH_LIMIT": 5,               // Maximum iterations to deepen research.
"MAXIMUM_FOLLOWUP_QUESTIONS": 5,         // Maximum follow-up questions generated.
"MAXIMUM_PRECISE_QUERIES": 5,            // Maximum search queries generated per cycle.
"SEARCH_TIMEOUT_MILISECONDS": 15000,     // Timeout for each search (milisecond).
"SEARCH_RATE_LIMIT_MILISECONDS": 5000,   // Pause between searches (milisecond).
"SEARCH_RESULT_LIMIT": 5,                // Maximum search results per query.
"OPENAI_MODEL": "o3-mini",               // Model used for processing tasks.
"OPENAI_MODEL_TOKEN_LIMIT": 200000,      // Maximum token limit per request.
"TIKTOKEN_ENCODING": "o200k_base"        // Tiktoken encoding corresponding to token limit.
```

## License
This project is licensed under the MIT License.
