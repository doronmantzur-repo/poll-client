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

  selectedPoll = null;
  selectedPollLoading = false;
  selectedPollError = null;

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

  async updatePoll(pollId, question, answers, userId) {
    this.error = null;
    try {
      const { poll } = await pollsApi.updatePoll(pollId, question, answers, userId);
      runInAction(() => {
        const index = this.polls.findIndex((p) => p.id === pollId);
        if (index !== -1) {
          this.polls[index] = poll;
        }
      });
      return true;
    } catch (err) {
      runInAction(() => {
        this.error = err.message;
      });
      return false;
    }
  }

  async deletePoll(pollId, userId) {
    this.error = null;
    try {
      await pollsApi.deletePoll(pollId, userId);
      runInAction(() => {
        this.polls = this.polls.filter((p) => p.id !== pollId);
      });
      return true;
    } catch (err) {
      runInAction(() => {
        this.error = err.message;
      });
      return false;
    }
  }

  async publishPoll(pollId, userId) {
    this.error = null;
    try {
      const { poll } = await pollsApi.publishPoll(pollId, userId);
      runInAction(() => {
        const existing = this.polls.find((p) => p.id === pollId);
        if (existing) {
          existing.is_public = poll.is_public;
        }
      });
      return true;
    } catch (err) {
      runInAction(() => {
        this.error = err.message;
      });
      return false;
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

  async submitAnswer(pollId, userId, answer) {
    this.voteError = null;
    try {
      await pollAnswersApi.submitAnswer(pollId, userId, answer);
      runInAction(() => {
        const poll = this.browsePolls.find((p) => p.id === pollId);
        if (poll) {
          poll.my_answers = [answer];
        }
        if (this.selectedPoll && this.selectedPoll.id === pollId) {
          this.selectedPoll.my_answers = [answer];
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

  async fetchPollById(pollId, userId) {
    this.selectedPollLoading = true;
    this.selectedPollError = null;
    this.selectedPoll = null;
    try {
      const { poll } = await pollsApi.getPollById(pollId, userId);
      runInAction(() => {
        this.selectedPoll = poll;
      });
    } catch (err) {
      runInAction(() => {
        this.selectedPollError = err.message;
      });
    } finally {
      runInAction(() => {
        this.selectedPollLoading = false;
      });
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
