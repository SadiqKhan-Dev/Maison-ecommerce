export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  addresses?: Address[];
  wishlist?: string[];
}
