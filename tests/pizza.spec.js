import { test, expect } from 'playwright-test-coverage';

test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});


test('view static pages', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'About' }).click();

    //assert//
    await expect(page.getByRole('main')).toContainText('The secret sauce');

    await page.getByRole('link', { name: 'History' }).click();

    //assert//
    await expect(page.getByRole('heading')).toContainText('Mama Rucci, my my');
});

test('view user info', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByPlaceholder('Full name').click();
    await page.getByPlaceholder('Full name').fill('Test user');
    await page.getByPlaceholder('Full name').press('Tab');
    await page.getByPlaceholder('Email address').fill('shimmyshimmyay001@gmail.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('001');
    await page.getByRole('button', { name: 'Register' }).click();
    await page.getByRole('link', { name: 'Tu' }).click();

    //assert//
    await expect(page.getByRole('heading')).toContainText('Your pizza kitchen');

    await page.getByText('Test user').click();

    //asserts//
    await expect(page.getByRole('main')).toContainText('Test user');
    await expect(page.getByRole('main')).toContainText('shimmyshimmyay001@gmail.com');
    await expect(page.getByRole('main')).toContainText('diner');
});

test('create/remove franchise - mocked', async ({ page }) => {

  var userType = 'admin'

  //mock returning an admin user
  await page.route('*/**/api/auth', async (route) => {
    if(userType == 'admin'){
      const loginReq = { email: 'fakeEmail@gmail.com', password: '000' };
      const loginRes = { user: { id: 10, name: 'Its Me', email: 'fakeEmail@gmail.com', roles: [{ role: 'admin' }] }, token: 'abcdefg' };
      expect(route.request().method()).toBe('PUT');
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    }
    else{
      const loginReq = { email: 'fakeEmail@gmail.com', password: '000' };
      const loginRes = { user: { id: 10, name: 'Its Me', email: 'fakeEmail@gmail.com', roles: [{ role: 'admin' }] }, token: 'abcdefg' };
      expect(route.request().method()).toBe('PUT');
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    }

  });

  //mock returning all franchises (admin control)
  //mock the creation of a franchise (admin control)
  await page.route('**/api/franchise', async (route) => {

    var callType = route.request().method()
    

    const franchiseListRes = 
    [
      { id: 1, name: 'Default Franchise', 
        admins: [{ email: 'shimmyshimmyay001@gmail.com', id: 50, name: 'Test User' }], 
        stores: [{ id: 1, name: 'Default Store 1', totalRevenue: 0}, { id: 2, name: 'Default Store 2', totalRevenue: 0.008}] 
      },
      { id: 10, name: 'Another Franchise', 
        admins: [{ email: 'shimmyshimmyay001@gmail.com', id: 50, name: 'Test User' }], 
        stores: [{ id: 3, name: 'Another Store 1', totalRevenue: 0}, { id: 4, name: 'Another Store 2', totalRevenue: 0.007}] 
      }
    ]
    const createFranchiseRes = 
    { id: 20, name: 'New Franchise', 
      admins: [{ email: 'shimmyshimmyay001@gmail.com', id: 50, name: 'Test User' }]
    }

    if(callType == 'GET'){
      console.log('GET method reached')
      route.fulfill({ json: franchiseListRes });
    }
    else if(callType == 'POST'){
      console.log('POST method reached')
      route.fulfill({ json: createFranchiseRes });
    }
    
  });

  //mock the deletion of a franchise (admin control)
  //should I use 20 instead of ':franchiseID' ?
  await page.route('**/api/franchise/10', async (route) => {
    const deleteFranchiseRes = { message: 'franchise deleted' }
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: deleteFranchiseRes });
  });

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('fakeEmail@gmail.com');

  await page.getByPlaceholder('Password').fill('000');

  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'Admin' }).click();
  
  await expect(page.getByRole('heading')).toContainText("Mama Ricci's kitchen");

  await page.getByRole('button', { name: 'Add Franchise' }).click();

  await page.getByPlaceholder('franchise name').click();
  await page.getByPlaceholder('franchise name').fill('New Franchise');

  await page.getByPlaceholder('franchisee admin email').click();
  await page.getByPlaceholder('franchisee admin email').fill('shimmyshimmyay001@gmail.com');

  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page.getByRole('heading')).toContainText("Mama Ricci's kitchen");

  await page.getByRole('row', { name: 'Another Franchise Test user Close' }).getByRole('button').click();
  await page.getByText('Sorry to see you go').click();
  await expect(page.getByRole('heading')).toContainText('Sorry to see you go');

  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('heading')).toContainText("Mama Ricci's kitchen");

});



test('purchase with login', async ({ page }) => {
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
      { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: 'LotaPizza',
        stores: [
          { id: 4, name: 'Lehi' },
          { id: 5, name: 'Springville' },
          { id: 6, name: 'American Fork' },
        ],
      },
      { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
      { id: 4, name: 'topSpot', stores: [] },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'd@jwt.com', password: 'a' };
    const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/order', async (route) => {

    var methodType = route.request().method()

    if(methodType == 'POST'){
      const orderReq = {
        items: [
          { menuId: 1, description: 'Veggie', price: 0.0038 },
          { menuId: 2, description: 'Pepperoni', price: 0.0042 },
        ],
        storeId: '4',
        franchiseId: 2,
      };
      const orderRes = {
        order: {
          items: [
            { menuId: 1, description: 'Veggie', price: 0.0038 },
            { menuId: 2, description: 'Pepperoni', price: 0.0042 },
          ],
          storeId: '4',
          franchiseId: 2,
          id: 23,
        },
        jwt: 'eyJpYXQ',
      };
      expect(route.request().method()).toBe('POST');
      expect(route.request().postDataJSON()).toMatchObject(orderReq);
      await route.fulfill({ json: orderRes });
    }
    else if(methodType == 'GET'){
      const pastOrders = { dinerId: 4, orders: [{ id: 1, franchiseId: 1, storeId: 1, date: '2024-06-05T05:14:40.000Z', items: [{ id: 1, menuId: 1, description: 'Veggie', price: 0.05 }] }], page: 1 }
      await route.fulfill({ json: pastOrders });
    }
    
    
  });

  await page.goto('/');

  // Go to order page
  await page.getByRole('button', { name: 'Order now' }).click();

  // Create order
  await expect(page.locator('h2')).toContainText('Awesome is a click away');
  await page.getByRole('combobox').selectOption('4');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await expect(page.locator('form')).toContainText('Selected pizzas: 2');
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Login
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  // Pay
  await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
  await expect(page.locator('tbody')).toContainText('Veggie');
  await expect(page.locator('tbody')).toContainText('Pepperoni');
  await expect(page.locator('tfoot')).toContainText('0.008 ₿');
  await page.getByRole('button', { name: 'Pay now' }).click();

  // Check balance
  await expect(page.getByText('0.008')).toBeVisible();

  //go to view past orders//
  await page.getByRole('link', { name: 'KC' }).click();
});


test('franchisee dash - mocked', async ({ page }) => {

  //mock returning a franchise user
  await page.route('*/**/api/auth', async (route) => {
    var methodType = route.request().method()
    if(methodType == 'PUT'){
      console.log('PUT method reached')
      const loginReq = { email: 'fakeEmail@gmail.com', password: '000' };
      const loginRes = { user: { id: 10, name: 'Its Me', email: 'fakeEmail@gmail.com', roles: [{ role: 'franchisee' }] }, token: 'abcdefg' };
      expect(route.request().method()).toBe('PUT');
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    }
    else if(methodType == 'DELETE'){
      console.log('DELETE method reached')
      const logoutRes = { message: 'logout successful' };
      await route.fulfill({ json: logoutRes });
    }
  });

  //mocking out the franchisee dashboard showing their stores
  // ...    /api/franchise/:userId
  await page.route('*/**/api/franchise/10', async (route) => {
    const storesRes = [{ id: 2, name: 'pizzaPocket', admins: [{ id: 10, name: 'Its Me', email: 'fakeEmail@gmail.com' }], stores: [{ id: 4, name: 'SLC', totalRevenue: 0 }] }]
    await route.fulfill({ json: storesRes });
  });

  //mocking out creating a store
  //...   using '2' instead of ':franchiseID'
  await page.route('*/**/api/franchise/2/store', async (route) => {
    const newStoreRes = { id: 99, franchiseId: 2, name: 'anotherOne' }
    await route.fulfill({ json: newStoreRes });
  });


  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('fakeEmail@gmail.com');

  // await page.getByPlaceholder('Password').fill('005'); //doesnt work
  // await page.getByRole('button', { name: 'Login' }).click();

  await page.getByPlaceholder('Password').fill('000');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();

  await page.getByRole('button', { name: 'Create store' }).click();
  await page.getByPlaceholder('store name').click();
  await page.getByPlaceholder('store name').fill('anotherOne');
  await page.getByRole('button', { name: 'Create' }).click();

  await page.getByRole('link', { name: 'Logout' }).click();

});

test('misc', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Order' }).click();
  await page.getByRole('link', { name: 'home' }).click();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await page.getByRole('link', { name: 'home' }).click();
  await page.getByLabel('Global').click();
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'home' }).click();
  await page.locator('.hs-carousel-pagination > span:nth-child(2)').click();
  await page.locator('span:nth-child(3)').click();
  await page.locator('span:nth-child(4)').click();
  await page.getByRole('link', { name: 'Register' }).click();
  await page.locator('div').filter({ hasText: /^JWT Pizza$/ }).click();
  await page.getByText('JWT Pizza', { exact: true }).click();
  await page.getByRole('link', { name: 'home' }).click();
  await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');
});

test('bad login', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('badEmail');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('bad');
  await page.locator('div').filter({ hasText: /^Password$/ }).getByRole('button').click();
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('badEmail@gmail.com');
  await page.getByRole('button', { name: 'Login' }).click();
});


