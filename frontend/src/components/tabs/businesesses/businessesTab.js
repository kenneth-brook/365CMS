//import AddBusiness from './AddBusiness.js';
//import EditBusiness from './EditBusiness.js';
import ListBusinesses from './listBusinesses.js';

class BusinessesTab {
  constructor(router) {
    this.router = router;
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.addRoute('businesses/add', () => this.showAddBusiness());
    this.router.addRoute('businesses/edit', () => this.showEditBusiness());
    this.router.addRoute('businesses/list', () => this.showListBusinesses());
    // Ensure a default route within 'businesses'
    this.router.addRoute('businesses', () => this.showListBusinesses());
  }

  showAddBusiness() {
    const view = new AddBusiness();
    document.querySelector('.tab-content').innerHTML = '';
    document.querySelector('.tab-content').appendChild(view.render());
  }

  showEditBusiness() {
    const view = new EditBusiness();
    document.querySelector('.tab-content').innerHTML = '';
    document.querySelector('.tab-content').appendChild(view.render());
  }

  showListBusinesses() {
    const view = new ListBusinesses();
    document.querySelector('.tab-content').innerHTML = '';
    document.querySelector('.tab-content').appendChild(view.render());
  }
}

export default BusinessesTab;