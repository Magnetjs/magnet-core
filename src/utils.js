// Wait Promise.all to finish all promise
// http://stackoverflow.com/a/31424853/788518
export async function reflect (promise) {
  try {
    const value = await promise
    return { value, status: 'resolved' }
  } catch (error) {
    return { error, status: 'rejected' }
  }
}
