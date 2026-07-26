export const USE_MOCK_DATA: boolean =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA !== undefined
    ? process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
    : false;