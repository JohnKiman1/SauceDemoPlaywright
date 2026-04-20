export const testData = {
  users: {
    valid: {
      username: 'standard_user',
      password: 'secret_sauce'
    },
    invalid: {
      username: 'invalid_user',
      password: 'wrong_password'
    },
    locked: {
      username: 'locked_out_user',
      password: 'secret_sauce'
    }
  },
  checkout: {
    valid: {
      firstName: 'John',
      lastName: 'Doe',
      postalCode: '12345'
    },
    invalid: {
      missingFirstName: {
        firstName: '',
        lastName: 'Doe',
        postalCode: '12345'
      },
      missingLastName: {
        firstName: 'John',
        lastName: '',
        postalCode: '12345'
      },
      missingPostalCode: {
        firstName: 'John',
        lastName: 'Doe',
        postalCode: ''
      }
    }
  },
  products: {
    backpack: 'Sauce Labs Backpack',
    bikeLight: 'Sauce Labs Bike Light',
    boltTShirt: 'Sauce Labs Bolt T-Shirt',
    fleeceJacket: 'Sauce Labs Fleece Jacket',
    onesie: 'Sauce Labs Onesie',
    redTShirt: 'Test.allTheThings() T-Shirt (Red)'
  }
};