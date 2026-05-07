const Storage = {
  getApiKey() {
    return localStorage.getItem('api_key') || '';
  },
  setApiKey(key) {
    localStorage.setItem('api_key', key);
  },

  getProfile() {
    try {
      return JSON.parse(localStorage.getItem('user_profile')) || {};
    } catch {
      return {};
    }
  },
  setProfile(profile) {
    localStorage.setItem('user_profile', JSON.stringify(profile));
  },

  getCompanies() {
    try {
      return JSON.parse(localStorage.getItem('companies')) || [];
    } catch {
      return [];
    }
  },
  getCompanyById(id) {
    return this.getCompanies().find(c => c.id === id) || null;
  },
  getCompanyByName(name) {
    return this.getCompanies().find(c => c.name === name) || null;
  },
  saveCompany(company) {
    const list = this.getCompanies().filter(c => c.id !== company.id);
    list.unshift(company);
    localStorage.setItem('companies', JSON.stringify(list));
  },
  deleteCompany(id) {
    const list = this.getCompanies().filter(c => c.id !== id);
    localStorage.setItem('companies', JSON.stringify(list));
  }
};
