import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import ApiBaseService from 'resources/services/api-base-service';
import CacheService from 'resources/services/cache-service';
import AuthService from 'resources/services/auth-service';
import ToastService from 'resources/services/toast-service';
import OperationService from 'resources/services/operation-service';

@inject(HttpClient, CacheService, AuthService, ToastService, OperationService)
export default class UserService extends ApiBaseService {
  constructor(httpClient, cacheService, authService, toastService, operationService)  {
    super(httpClient, cacheService, authService, toastService);
    this.operationService = operationService;
  }

  async signIn(account) {
    return await this.post('sign-in', account);
  }

  async signUp(account) {
    return await this.operationService.execute(async ()
      => await this.post('sign-up', account));
  }

  async getAccount(cache = true) {
    return await this.get('account', {}, cache);
  }

  async getAccountByName(name) {
    return await this.get(`users/${name}`);
  }

  async isNameAvailable(name) {
    return await this.get(`account/names/${name}/available`, {}, false);
  }

  async changeUsername(name) {
    return await this.operationService.execute(async ()
      => await this.put('account/name', { name }));
  }

  async changePassword(currentPassword, newPassword) {
    return await this.operationService.execute(async ()
      => await this.put('account/password', { currentPassword, newPassword }));
  }

  async resetPassword(email) {
    return await this.operationService.execute(async ()
      => await this.post('reset-password', { email }));
  }

  async setNewPassword(email, token, password) {
    return await this.operationService.execute(async ()
      => await this.post('reset-password/set-new', { email, token, password }));
  }
}
