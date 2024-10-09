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
  //mock returning an admin user
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'rex.okland@gmail.com', password: '000' };
    const loginRes = { user: { id: 10, name: 'Rex Okland', email: 'rex.okland@gmail.com', roles: [{ role: 'admin' }] }, token: 'abcdefg' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
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

  // await page.route('**/api/franchise/20', async (route) => {
  //   deleteFranchiseRes: { message: 'franchise deleted' }
  //   expect(route.request().method()).toBe('DELETE');
  //   await route.fulfill({ json: deleteFranchiseRes });
  // });

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('rex.okland@gmail.com');

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

  // await page.getByRole('row', { name: 'New Franchise Test user Close' }).getByRole('button').click();
  // await page.getByText('Sorry to see you go').click();
  // await expect(page.getByRole('heading')).toContainText('Sorry to see you go');

  // await page.getByRole('button', { name: 'Close' }).click();
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
});

