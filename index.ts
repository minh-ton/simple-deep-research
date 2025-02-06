/*
 * Project: simple-deep-research
 * Author: Minh-Ton
 * GitHub: https://github.com/minh-ton/simple-deep-research
 * Description: A simplified version of OpenAI’s Deep Research Agent.
 *
 * How it works:
 *
 * 1. Ask the LLM to generate follow-up questions to clarify the research direction.
 *
 * 2. Process the user's query:
 *    a. Ask the LLM to generate precise search queries based on the user’s query.
 *    b. Perform a Google search using the generated queries and fetch the text from each result.
 *    c. Evaluate whether a webpage is useful for the research by prompting the LLM.
 *    d. If a webpage is useful, extract relevant information based on both the queries and the webpage content.
 *    e. Assess whether the collected content and search queries sufficiently answer the research question. If not, generate additional search queries to continue the search.
 *
 * 3. Generate the final research report.
 *
 * Note: Step 2 can be executed recursively for deeper research.
 */

import { DeepResearch } from "./src/deep-research";

void DeepResearch();