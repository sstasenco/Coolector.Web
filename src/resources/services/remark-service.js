import {inject} from 'aurelia-framework';
import ApiBaseService from 'resources/services/api-base-service';
import OperationService from 'resources/services/operation-service';

@inject(OperationService, ApiBaseService)
export default class RemarkService {
  constructor(operationService, apiBaseService) {
    this.operationService = operationService;
    this.apiBaseService = apiBaseService;
  }

  async sendRemark(remark) {
    this._clearRemarksCache();

    return await this.operationService.execute(async ()
      => await this.apiBaseService.post('remarks', remark));
  }

  async browse(query) {
    //Building custom key with fixed lat & lng, so it works properly for minimal location updates.
    let path = 'remarks';
    let latitude = query.latitude || 0;
    let longitude = query.longitude || 0;
    query.latitude = parseFloat(latitude.toFixed(5));
    query.longitude = parseFloat(longitude.toFixed(5));
    let newCacheKey = this.apiBaseService.buildPathWithQuery(path, query);
    let hasKey = this.apiBaseService.cacheService.hasKey(`cache/api/${newCacheKey}`);
    if (!hasKey) {
      this._clearRemarksCache();
    }

    query.latitude = latitude;
    query.longitude = longitude;

    return await this.apiBaseService.get(path, query, true, newCacheKey);
  }

  async getCategories() {
    return await this.apiBaseService.get('remarks/categories');
  }

  async getRemark(id) {
    return await this.apiBaseService.get(`remarks/${id}`, {}, false);
  }

  async resolveRemark(command) {
    this._clearRemarksCache();

    return await this.operationService.execute(async ()
      => await this.apiBaseService.put(`remarks/${command.remarkId}/resolve`, command));
  }

  async deleteRemark(id) {
    this._clearRemarksCache();

    return await this.operationService.execute(async ()
      => await this.apiBaseService.delete(`remarks/${id}`));
  }

  get remarksRegexp() {
    return /^cache\/api\/remarks.*/;
  }

  _clearRemarksCache() {
    this.apiBaseService.cacheService.invalidateMatchingKeys(this.remarksRegexp);
  }
}
