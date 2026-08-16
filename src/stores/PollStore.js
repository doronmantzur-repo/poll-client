import { makeAutoObservable, runInAction } from "mobx";
import * as pollsApi from "../api/pollsApi";
import * as pollAnswersApi from "../api/pollAnswersApi";

class PollStore {
  polls = [];
  loading = false;
  error = null;

  browsePolls = [];
  browseLoading = false;
  browseError = null;
  voteError = null;

  resultsPolls = [];
  resultsLoading = false;
  resultsError = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchMyPolls(userId) {
    this.loading = true;
    this.error = null;
    try {
      const { polls } = await pollsApi.getMyPolls(userId);
      runInAction(() => {
        this.polls = polls;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async createPoll(question, answers, isPublic, userId) {
    this.loading = true;
    this.error = null;
    try {
      const { poll } = await pollsApi.createPoll(question, answers, isPublic, userId);
      runInAction(() => {
        this.polls.unshift(poll);
      });
      return true;
    } catch (err) {
      runInAction(() => {
        this.error = err.message;
      });
      return false;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchBrowsePolls(userId) {
    this.browseLoading = true;
    this.browseError = null;
    try {
      const { polls } = await pollsApi.getBrowsePolls(userId);
      runInAction(() => {
        this.browsePolls = polls;
      });
    } catch (err) {
      runInAction(() => {
        this.browseError = err.message;
      });
    } finally {
      runInAction(() => {
        this.browseLoading = false;
      });
    }
  }

  async submitAnswers(pollId, userId, answers) {
    this.voteError = null;
    try {
      await pollAnswersApi.submitAnswers(pollId, userId, answers);
      runInAction(() => {
        const poll = this.browsePolls.find((p) => p.id === pollId);
        if (poll) {
          poll.my_answers = answers;
        }
      });
      return true;
    } catch (err) {
      runInAction(() => {
        this.voteError = err.message;
      });
      return false;
    }
  }

  async fetchResults() {
    this.resultsLoading = true;
    this.resultsError = null;
    try {
      const { polls } = await pollsApi.getPublicResults();
      runInAction(() => {
        this.resultsPolls = polls;
      });
    } catch (err) {
      runInAction(() => {
        this.resultsError = err.message;
      });
    } finally {
      runInAction(() => {
        this.resultsLoading = false;
      });
    }
  }
}

const pollStore = new PollStore();
export default pollStore;
