export const apiRoutes = {
  realstate: {
    properties: 'properties/',
    allImages: 'properties/:id/get-images/',
    uploadImages: 'properties/:id/upload-images/',
    deleteImage: 'properties/:id/delete-image/',
    updateImagesOrder: 'properties/:id/reorder-images/',
    addCharacteristic: 'properties/:id/add-characteristic/',
    deleteCharacteristic: 'properties/:id/delete-characteristic/',
    updateCharacteristic: 'properties/:id/update-characteristic/',
    getCharacteristics: 'properties/:id/characteristics/',

    characteristics: 'property-characteristics/',
    propertyStatus: 'property-status/',
    typeNegotiations: 'type-negotiations/',
    propertyTypes: 'property-types/',
    franchises: 'franchises/',
    usersByFranchise: 'users-by-franchise/'
  },
  locations: {
    cities: 'cities/',
    states: 'states/'
  },
  crm: {
    clients: 'clients/',
    clientStatus: 'client-status/',
    visits: 'visits/',
    searches: 'searches/'
  }
}

