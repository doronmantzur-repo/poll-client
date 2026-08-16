import { makeAutoObservable, runInAction } from "mobx";
import * as pollsApi from "../api/pollsApi";

class PollStore {
  polls = [];
  loading = false;
  error = null;

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
}

const pollStore = new PollStore();
export default pollStore;
