import {inject, bindable} from 'aurelia-framework';
import AuthService from 'resources/services/auth-service';
import ToastService from 'resources/services/toast-service';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(AuthService, ToastService, EventAggregator)
export class NavBar {
  @bindable router = null;

  constructor(authService, toastService, eventAggregator) {
    this.authService = authService;
    this.toast = toastService;
    this.eventAggregator = eventAggregator;
    this.locationErrorSubscription = null;
  }

  async attached() {
    $('.button-collapse').sideNav({
      closeOnClick: true
    });

    this.locationErrorSubscription = await this.eventAggregator.subscribe('location:error',
      async response => {
        this.logout();
        await this.toast.error('Location is required to run this app.');
      });
  }

  detached() {
    this.locationErrorSubscription.dispose();
  }

  logout() {
    this.authService.logout();
    this.router.navigateToRoute('start');
  }

  back() {
    this.router.navigateBack();
  }

  get canGoBack() {
    let routes = [ '/location', '/remarks' ];
    return !(routes.includes(this.router.history.previousLocation));
  }

  get navigation() {
    let customNav = [];
    for (let navModel of this.router.navigation) {
      if (!((this.authService.isLoggedIn && navModel.settings.navHideAfterLogin ) ||
                 (!this.authService.isLoggedIn && navModel.settings.reqLogin ))) {
        customNav.push(navModel);
      }
    }
    return customNav;
  }
}
