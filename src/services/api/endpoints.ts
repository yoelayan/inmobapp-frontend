export const ENDPOINTS = {
  REALSTATE: {
    PROPERTIES: {
      BASE: '/properties/',
      BY_ID: (id: number) => `/properties/${id}/`,
      METRICS: '/properties/metrics/',
      TOTAL: '/properties/total/',
      IMAGES: {
        ALL: (id: number) => `/properties/${id}/get-images/`,
        UPLOAD: (id: number) => `/properties/${id}/upload-images/`,
        DELETE: (id: number) => `/properties/${id}/delete-image/`,
        REORDER: (id: number) => `/properties/${id}/reorder-images/`,
      },
      CHARACTERISTICS: {
        BASE: (id: number) => `/properties/${id}/characteristics/`,
        ADD: (id: number) => `/properties/${id}/add-characteristic/`,
        DELETE: (id: number) => `/properties/${id}/delete-characteristic/`,
        UPDATE: (id: number) => `/properties/${id}/update-characteristic/`,
      },
    },
    PROPERTY_CHARACTERISTICS: {
      BASE: '/property-characteristics/',
    },
    PROPERTY_STATUS: {
      BASE: '/property-status/',
    },
    TYPE_NEGOTIATIONS: {
      BASE: '/type-negotiations/',
    },
    PROPERTY_TYPES: {
      BASE: '/property-types/',
    },
    FRANCHISES: {
      BASE: '/franchises/',
    },
  },
  LOCATIONS: {
    CITIES: {
      BASE: '/cities/',
    },
    STATES: {
      BASE: '/states/',
    },
  },
  CRM: {
    CLIENTS: {
      BASE: '/clients/',
      BY_ID: (id: number) => `/clients/${id}/`,
    },
    CLIENT_STATUS: {
      BASE: '/client-status/',
    },
    VISITS: {
      BASE: '/visits/',
    },
    SEARCHES: {
      BASE: '/searches/',
      BY_ID: (id: number) => `/searches/${id}/`,
      PROPERTIES_MATCHED: (id: number) => `/searches/${id}/properties_matched/`,
      CHARACTERISTICS: {
        ADD: (id: number) => `/searches/${id}/add-characteristic/`,
        DELETE: (id: number) => `/searches/${id}/delete-characteristic/`,
      },
      OBSERVATIONS: {
        ADD: (id: number) => `/searches/${id}/add-observation/`,
        DELETE: (id: number) => `/searches/${id}/delete-observation/`,
      },
    },
  },
  USERS: {
    BASE: '/users/',
    BY_ID: (id: number) => `/users/${id}/`,
    BY_FRANCHISE: (franchiseId: number) => `/users/franchise/${franchiseId}/`,
    GROUPS: {
      BASE: '/groups/',
    }
  },
};
