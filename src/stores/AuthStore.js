import { makeAutoObservable, runInAction } from "mobx";
import * as authApi from "../api/authApi";

class AuthStore {
  user = null;
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isAuthenticated() {
    return this.user !== null;
  }

  async signup(user_name, password) {
    this.loading = true;
    this.error = null;
    try {
      const { user } = await authApi.signup(user_name, password);
      runInAction(() => {
        this.user = user;
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

  async login(user_name, password) {
    this.loading = true;
    this.error = null;
    try {
      const { user } = await authApi.login(user_name, password);
      runInAction(() => {
        this.user = user;
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

  logout() {
    this.user = null;
    this.error = null;
  }

  clearError() {
    this.error = null;
  }
}

const authStore = new AuthStore();
export default authStore;
