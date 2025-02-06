import chalk from 'chalk';
import * as fs from 'fs/promises';
import readline = require('readline-sync');

import { firecrawl } from './lib/firecrawl';
import { generateFollowUpQuestions } from './tasks/follow-up';
import { generatePreciseQueries } from './tasks/precise-query';
import { extractInsights } from './tasks/extract-insights';
import { assessSufficiency } from './tasks/assess-sufficiency';
import { generateResearchReport } from './tasks/generate-research';
import {
  RESEARCH_DEPTH_LIMIT,
  SEARCH_RATE_LIMIT_MILISECONDS,
  SEARCH_TIMEOUT_MILISECONDS,
  SEARCH_RESULT_LIMIT,
} from '../constant-config.json';

interface ResearchState {
  collectedLearnings: string[];
  sourceURLs: string[];
  allURLs: string[];
  userSearchQuery: string;
  followUpQuestions: string[];
  researchDepth: number;
}

const state: ResearchState = {
  collectedLearnings: [],
  sourceURLs: [],
  allURLs: [],
  userSearchQuery: '',
  followUpQuestions: [],
  researchDepth: 0,
};

function askFollowUpQuestion(questions: string[]): string[] {
  console.log(
    chalk.blue.bold(
      "\nLet's refine our research focus with a few quick questions:",
    ),
  );

  return questions.map(question => {
    const answer = readline.question(
      chalk.magenta.bold(`\n+ ${question}`) + '\n> ',
    );
    return `<question>${question}</question>: <answer>${answer}</answer>`;
  });
}

async function generateInitialQueries(): Promise<string[]> {
  state.userSearchQuery = readline.question(
    chalk.green.bold('What would you like to research today? \n> '),
  );
  const followUpQuestionsList = await generateFollowUpQuestions(
    state.userSearchQuery,
  );
  const followUpQA = askFollowUpQuestion(followUpQuestionsList);
  state.followUpQuestions.push(...followUpQA);
  return generatePreciseQueries(
    state.userSearchQuery,
    state.followUpQuestions,
    state.collectedLearnings,
  );
}

async function handleSearchResults(query: string) {
  const result = await firecrawl.search(query, {
    timeout: SEARCH_TIMEOUT_MILISECONDS,
    limit: SEARCH_RESULT_LIMIT,
    scrapeOptions: { formats: ['markdown'] },
  });

  console.log(chalk.blue.bold(`\nSearching for "${query}"...`));

  for (const res of result.data) {
    const { title, url = '', markdown: pageContent = '' } = res;

    if (state.allURLs.includes(url)) continue;
    state.allURLs.push(url);

    const webpageInsights = await extractInsights(url, pageContent, query);

    if (webpageInsights.relevance.toLowerCase().includes('yes')) {
      console.log(chalk.yellow.bold(`Reading "${title}" from "${url}"`));
      console.log(chalk.green(`+ ${webpageInsights.summary}`));
      state.collectedLearnings.push(...webpageInsights.insights);
      state.sourceURLs.push(url);
    }
  }
}

export const DeepResearch = async (preciseQueries: string[] = []) => {
  try {
    const queries =
      preciseQueries.length === 0
        ? await generateInitialQueries()
        : preciseQueries;

    for (const query of queries) {
      await handleSearchResults(query);
      await new Promise(resolve =>
        setTimeout(resolve, SEARCH_RATE_LIMIT_MILISECONDS),
      );
    }

    console.log(chalk.blue.bold("\nAnalyzing what we've learned so far..."));
    const sufficiencyAssessment = await assessSufficiency(
      state.collectedLearnings,
      state.userSearchQuery,
      queries,
    );

    console.log(
      chalk.bold(`\nSummary:`),
      sufficiencyAssessment.sufficiencyAssessment,
    );

    if (
      sufficiencyAssessment.additionalQueries.length > 0 &&
      state.researchDepth < RESEARCH_DEPTH_LIMIT
    ) {
      console.log(
        chalk.blue.bold("Let's dive deeper to gather more insights!\n"),
      );
      state.researchDepth = state.researchDepth + 1;

      // Deepen the research with the additional queries
      await DeepResearch(sufficiencyAssessment.additionalQueries);
    } else {
      console.log(
        chalk.green.bold("Great! We've finished gathering all the insights!\n"),
      );
      console.log(
        chalk.blue.bold(
          'Creating your research report... This might take a moment!',
        ),
      );
      let researchReport = await generateResearchReport(
        state.collectedLearnings,
        state.userSearchQuery,
        queries,
        state.followUpQuestions,
      );
      researchReport += `\n## Reference Sources\n${state.sourceURLs.map(url => `- ${url}`).join('\n')}`;

      await fs.writeFile('research.md', researchReport, 'utf-8');
      console.log(
        chalk.green.bold(
          '\nYour research report is ready! You can find it in research.md',
        ),
      );
    }
  } catch (error) {
    console.error(error);

    // If an error occurs, continue the research with the remaining queries
    await new Promise(resolve =>
      setTimeout(resolve, SEARCH_RATE_LIMIT_MILISECONDS),
    );
    await DeepResearch(preciseQueries);
  }
};
