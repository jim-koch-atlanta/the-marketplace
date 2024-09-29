beforeEach(() => {
    // Suppress console.error in all tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    // Restore console.error after all tests
    jest.restoreAllMocks();
});
